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
            borderBottom: '3px solid #FF9800',
            paddingBottom: '10px'
          }}>
            📊 ログ表示
          </h1>
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

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #ddd' }}>
          <button
            onClick={() => setActiveTab('display')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'display' ? '3px solid #FF9800' : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'display' ? 'bold' : 'normal',
              color: activeTab === 'display' ? '#FF9800' : '#666'
            }}
          >
            📺 表示ログ ({displayLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('change')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'change' ? '3px solid #FF9800' : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'change' ? 'bold' : 'normal',
              color: activeTab === 'change' ? '#FF9800' : '#666'
            }}
          >
            📝 変更ログ ({changeLogs.length})
          </button>
        </div>

      {activeTab === 'display' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', margin: 0, color: '#444', borderLeft: '4px solid #FF9800', paddingLeft: '12px' }}>
              表示ログ
            </h2>
            <button
              onClick={handleExportDisplayLogs}
              style={{ 
                padding: '10px 20px', 
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
              📥 CSV出力
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#FF9800', color: 'white' }}>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>メッセージ</th>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', width: '180px' }}>開始時刻</th>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', width: '180px' }}>終了時刻</th>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', width: '100px' }}>表示時間</th>
              </tr>
            </thead>
            <tbody>
              {displayLogs.map((log, index) => (
                <tr key={log.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{log.messageContent}</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{formatDateTime(log.startTime)}</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{formatDateTime(log.endTime)}</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{formatDuration(log.startTime, log.endTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayLogs.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              color: '#999',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <p style={{ fontSize: '18px', margin: 0 }}>📭 表示ログがまだありません</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'change' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', margin: 0, color: '#444', borderLeft: '4px solid #FF9800', paddingLeft: '12px' }}>
              変更ログ
            </h2>
            <button
              onClick={handleExportChangeLogs}
              style={{ 
                padding: '10px 20px', 
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
              📥 CSV出力
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#FF9800', color: 'white' }}>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', width: '180px' }}>日時</th>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', width: '120px' }}>操作</th>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left', width: '100px' }}>対象</th>
                <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>詳細</th>
              </tr>
            </thead>
            <tbody>
              {changeLogs.map((log, index) => (
                <tr key={log.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{formatDateTime(log.timestamp)}</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{log.action}</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{log.target}</td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {changeLogs.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              color: '#999',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <p style={{ fontSize: '18px', margin: 0 }}>📭 変更ログがまだありません</p>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default LogViewer;
