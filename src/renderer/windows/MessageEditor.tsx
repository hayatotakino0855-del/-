import React, { useEffect, useState } from 'react';
import { Message, createDefaultMessage } from '../../shared/models/Message';

const MessageEditor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const allMessages = await window.electronAPI.getMessages();
      setMessages(allMessages.sort((a: Message, b: Message) => a.order - b.order));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleCreateNew = () => {
    const newMessage = createDefaultMessage(messages.length + 1);
    setEditingMessage(newMessage);
    setIsDialogOpen(true);
  };

  const handleEdit = (message: Message) => {
    setEditingMessage({ ...message });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await window.electronAPI.deleteMessage(id);
        await loadMessages();
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const handleSave = async () => {
    if (!editingMessage) return;

    try {
      if (messages.find((m) => m.id === editingMessage.id)) {
        await window.electronAPI.updateMessage(editingMessage.id, editingMessage);
      } else {
        await window.electronAPI.saveMessage(editingMessage);
      }
      setIsDialogOpen(false);
      setEditingMessage(null);
      await loadMessages();
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newMessages = [...messages];
    [newMessages[index - 1], newMessages[index]] = [newMessages[index], newMessages[index - 1]];
    newMessages.forEach((msg, idx) => {
      msg.order = idx + 1;
    });
    setMessages(newMessages);
    for (const msg of newMessages) {
      await window.electronAPI.updateMessage(msg.id, msg);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === messages.length - 1) return;
    const newMessages = [...messages];
    [newMessages[index], newMessages[index + 1]] = [newMessages[index + 1], newMessages[index]];
    newMessages.forEach((msg, idx) => {
      msg.order = idx + 1;
    });
    setMessages(newMessages);
    for (const msg of newMessages) {
      await window.electronAPI.updateMessage(msg.id, msg);
    }
  };

  const getScheduleDisplay = (message: Message): string => {
    switch (message.schedule.type) {
      case 'always':
        return 'Always';
      case 'weekdays':
        return 'Weekdays';
      case 'weekend':
        return 'Weekend';
      case 'custom':
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Message Editor</h1>
        <div>
          <button
            onClick={handleCreateNew}
            style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer', marginRight: '10px' }}
          >
            + New Message
          </button>
          <button
            onClick={() => window.close()}
            style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd', width: '80px' }}>Order</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Message</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', width: '120px' }}>Schedule</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', width: '100px' }}>Enabled</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', width: '200px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, index) => (
            <tr key={message.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                <button onClick={() => handleMoveUp(index)} disabled={index === 0} style={{ marginRight: '5px' }}>
                  ↑
                </button>
                {message.order}
                <button onClick={() => handleMoveDown(index)} disabled={index === messages.length - 1} style={{ marginLeft: '5px' }}>
                  ↓
                </button>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{message.content}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {getScheduleDisplay(message)}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {message.enabled ? '✓' : '✗'}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                <button
                  onClick={() => handleEdit(message)}
                  style={{ padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(message.id)}
                  style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ff4444', color: 'white', border: 'none' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {messages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No messages yet. Click "New Message" to create one.
        </div>
      )}

      {isDialogOpen && editingMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2>{messages.find((m) => m.id === editingMessage.id) ? 'Edit Message' : 'New Message'}</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message Content:</label>
              <textarea
                value={editingMessage.content}
                onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                style={{ width: '100%', minHeight: '100px', padding: '10px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={editingMessage.enabled}
                  onChange={(e) => setEditingMessage({ ...editingMessage, enabled: e.target.checked })}
                />
                {' '}Enabled
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Schedule Type:</label>
              <select
                value={editingMessage.schedule.type}
                onChange={(e) =>
                  setEditingMessage({
                    ...editingMessage,
                    schedule: { ...editingMessage.schedule, type: e.target.value as any },
                  })
                }
                style={{ width: '100%', padding: '10px', fontSize: '14px' }}
              >
                <option value="always">Always</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekend">Weekend (Sat-Sun)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {editingMessage.schedule.type === 'custom' && (
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Days of Week:</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <label key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={editingMessage.schedule.daysOfWeek?.includes(index) || false}
                        onChange={(e) => {
                          const daysOfWeek = editingMessage.schedule.daysOfWeek || [];
                          if (e.target.checked) {
                            setEditingMessage({
                              ...editingMessage,
                              schedule: {
                                ...editingMessage.schedule,
                                daysOfWeek: [...daysOfWeek, index].sort(),
                              },
                            });
                          } else {
                            setEditingMessage({
                              ...editingMessage,
                              schedule: {
                                ...editingMessage.schedule,
                                daysOfWeek: daysOfWeek.filter((d) => d !== index),
                              },
                            });
                          }
                        }}
                      />
                      {' '}{day}
                    </label>
                  ))}
                </div>

                <label style={{ display: 'block', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                  Time Range:
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="time"
                    value={editingMessage.schedule.timeRanges?.[0]?.startTime || '00:00'}
                    onChange={(e) => {
                      const timeRanges = editingMessage.schedule.timeRanges || [{ startTime: '00:00', endTime: '23:59' }];
                      timeRanges[0].startTime = e.target.value;
                      setEditingMessage({
                        ...editingMessage,
                        schedule: { ...editingMessage.schedule, timeRanges },
                      });
                    }}
                    style={{ padding: '8px', fontSize: '14px' }}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={editingMessage.schedule.timeRanges?.[0]?.endTime || '23:59'}
                    onChange={(e) => {
                      const timeRanges = editingMessage.schedule.timeRanges || [{ startTime: '00:00', endTime: '23:59' }];
                      timeRanges[0].endTime = e.target.value;
                      setEditingMessage({
                        ...editingMessage,
                        schedule: { ...editingMessage.schedule, timeRanges },
                      });
                    }}
                    style={{ padding: '8px', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingMessage(null);
                }}
                style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageEditor;
