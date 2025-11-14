import React, { useEffect, useState } from 'react';
import { DisplayLog, ChangeLog } from '../../shared/models/Log';

const LogViewer: React.FC = () => {
  const [displayLogs, setDisplayLogs] = useState<DisplayLog[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [activeTab, setActiveTab] = useState<'display' | 'change'>('display');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const [displayLogsData, changeLogsData] = await Promise.all([
        window.electronAPI.getDisplayLogs(),
        window.electronAPI.getChangeLogs(),
      ]);
      setDisplayLogs(displayLogsData);
      setChangeLogs(changeLogsData);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (startTime: string, endTime: string): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleExportDisplayLogs = () => {
    const csv = [
      ['Message ID', 'Message Content', 'Start Time', 'End Time', 'Duration'].join(','),
      ...displayLogs.map((log) => [
        log.messageId,
        `"${log.messageContent.replace(/"/g, '""')}"`,
        log.startTime,
        log.endTime,
        formatDuration(log.startTime, log.endTime),
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `display-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportChangeLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'Target', 'Details'].join(','),
      ...changeLogs.map((log) => [
        log.timestamp,
        log.action,
        log.target,
        `"${log.details.replace(/"/g, '""')}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `change-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Log Viewer</h1>
        <button
          onClick={() => window.close()}
          style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('display')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'display' ? '3px solid #4CAF50' : 'none',
            backgroundColor: 'transparent',
          }}
        >
          Display Logs ({displayLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('change')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'change' ? '3px solid #4CAF50' : 'none',
            backgroundColor: 'transparent',
          }}
        >
          Change Logs ({changeLogs.length})
        </button>
      </div>

      {activeTab === 'display' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2>Display Logs</h2>
            <button
              onClick={handleExportDisplayLogs}
              style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
            >
              Export to CSV
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Message</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', width: '180px' }}>Start Time</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', width: '180px' }}>End Time</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', width: '100px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {displayLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.messageContent}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDateTime(log.startTime)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDateTime(log.endTime)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDuration(log.startTime, log.endTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayLogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No display logs yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'change' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2>Change Logs</h2>
            <button
              onClick={handleExportChangeLogs}
              style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
            >
              Export to CSV
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', width: '180px' }}>Timestamp</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', width: '120px' }}>Action</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', width: '100px' }}>Target</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {changeLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDateTime(log.timestamp)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.action}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.target}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {changeLogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No change logs yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogViewer;
