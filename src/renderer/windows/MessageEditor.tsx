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
    if (confirm('このメッセージを削除してもよろしいですか？')) {
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
        return '常時表示';
      case 'weekdays':
        return '平日のみ';
      case 'weekend':
        return '週末のみ';
      case 'custom':
        return 'カスタム';
      default:
        return '不明';
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'メイリオ, Meiryo, "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            margin: 0,
            color: '#333',
            borderBottom: '3px solid #4CAF50',
            paddingBottom: '10px'
          }}>
            📝 メッセージ編集
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCreateNew}
              style={{ 
                padding: '12px 24px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ➕ 新規メッセージ
            </button>
            <button
              onClick={() => window.close()}
              style={{ 
                padding: '12px 24px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              閉じる
            </button>
          </div>
        </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <th style={{ padding: '15px', border: '1px solid #ddd', width: '120px' }}>順序</th>
            <th style={{ padding: '15px', border: '1px solid #ddd' }}>メッセージ内容</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', width: '120px' }}>スケジュール</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', width: '100px' }}>有効</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', width: '200px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, index) => (
            <tr key={message.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>
                <button 
                  onClick={() => handleMoveUp(index)} 
                  disabled={index === 0} 
                  style={{ 
                    marginRight: '5px',
                    padding: '5px 10px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    backgroundColor: index === 0 ? '#ccc' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  ↑
                </button>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{message.order}</span>
                <button 
                  onClick={() => handleMoveDown(index)} 
                  disabled={index === messages.length - 1} 
                  style={{ 
                    marginLeft: '5px',
                    padding: '5px 10px',
                    cursor: index === messages.length - 1 ? 'not-allowed' : 'pointer',
                    backgroundColor: index === messages.length - 1 ? '#ccc' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  ↓
                </button>
              </td>
              <td style={{ padding: '15px', border: '1px solid #ddd' }}>{message.content}</td>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>
                <span style={{ 
                  padding: '4px 12px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#1976d2'
                }}>
                  {getScheduleDisplay(message)}
                </span>
              </td>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>
                <span style={{ fontSize: '20px' }}>{message.enabled ? '✅' : '❌'}</span>
              </td>
              <td style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>
                <button
                  onClick={() => handleEdit(message)}
                  style={{ 
                    padding: '8px 16px', 
                    marginRight: '8px', 
                    cursor: 'pointer',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  ✏️ 編集
                </button>
                <button
                  onClick={() => handleDelete(message.id)}
                  style={{ 
                    padding: '8px 16px', 
                    cursor: 'pointer', 
                    backgroundColor: '#f44336', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  🗑️ 削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {messages.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          color: '#999',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ fontSize: '18px', margin: 0 }}>📭 メッセージがまだありません</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>「新規メッセージ」ボタンをクリックして作成してください</p>
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              width: '700px',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ 
              marginTop: 0, 
              marginBottom: '30px',
              fontSize: '24px',
              color: '#333',
              borderBottom: '2px solid #4CAF50',
              paddingBottom: '10px'
            }}>
              {messages.find((m) => m.id === editingMessage.id) ? '✏️ メッセージを編集' : '➕ 新規メッセージ'}
            </h2>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
                メッセージ内容:
              </label>
              <textarea
                value={editingMessage.content}
                onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                style={{ 
                  width: '100%', 
                  minHeight: '120px', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="テロップに表示するメッセージを入力してください"
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '16px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingMessage.enabled}
                  onChange={(e) => setEditingMessage({ ...editingMessage, enabled: e.target.checked })}
                  style={{ width: '20px', height: '20px', marginRight: '10px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 'bold', color: '#555' }}>このメッセージを有効にする</span>
              </label>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
                表示スケジュール:
              </label>
              <select
                value={editingMessage.schedule.type}
                onChange={(e) =>
                  setEditingMessage({
                    ...editingMessage,
                    schedule: { ...editingMessage.schedule, type: e.target.value as any },
                  })
                }
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <option value="always">常時表示</option>
                <option value="weekdays">平日のみ（月〜金）</option>
                <option value="weekend">週末のみ（土・日）</option>
                <option value="custom">カスタム設定</option>
              </select>
            </div>

            {editingMessage.schedule.type === 'custom' && (
              <div style={{ 
                marginBottom: '25px', 
                padding: '20px', 
                backgroundColor: '#f0f7ff', 
                borderRadius: '8px',
                border: '2px solid #2196F3'
              }}>
                <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '16px', color: '#1976d2' }}>
                  📅 曜日を選択:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <label 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: editingMessage.schedule.daysOfWeek?.includes(index) ? '#2196F3' : 'white',
                        color: editingMessage.schedule.daysOfWeek?.includes(index) ? 'white' : '#333',
                        borderRadius: '8px',
                        border: '2px solid #2196F3',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    >
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
                        style={{ display: 'none' }}
                      />
                      {day}
                    </label>
                  ))}
                </div>

                <label style={{ display: 'block', marginTop: '20px', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px', color: '#1976d2' }}>
                  ⏰ 時間帯:
                </label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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
                    style={{ 
                      padding: '10px', 
                      fontSize: '16px',
                      border: '2px solid #2196F3',
                      borderRadius: '8px',
                      flex: 1
                    }}
                  />
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>〜</span>
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
                    style={{ 
                      padding: '10px', 
                      fontSize: '16px',
                      border: '2px solid #2196F3',
                      borderRadius: '8px',
                      flex: 1
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingMessage(null);
                }}
                style={{ 
                  padding: '12px 30px', 
                  fontSize: '16px', 
                  cursor: 'pointer',
                  backgroundColor: '#757575',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                💾 保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageEditor;
