import React from 'react';

const MainControl: React.FC = () => {
  const handleOpenMessageEditor = () => {
    window.electronAPI.openMessageEditor();
  };

  const handleOpenSettings = () => {
    window.electronAPI.openSettings();
  };

  const handleOpenLogViewer = () => {
    window.electronAPI.openLogViewer();
  };

  const handleOpenContentWindow = () => {
    window.electronAPI.openContentWindow('video', 'https://example.com/video.mp4');
  };

  const handleToggleTeleop = () => {
    window.electronAPI.toggleTeleop(true);
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'メイリオ, Meiryo, "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          marginBottom: '10px',
          color: '#333',
          borderBottom: '3px solid #4CAF50',
          paddingBottom: '10px'
        }}>
          テロップアプリ - コントロールパネル
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>バージョン 0.1.0</p>
        
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            marginBottom: '15px',
            color: '#444',
            borderLeft: '4px solid #4CAF50',
            paddingLeft: '12px'
          }}>
            ウィンドウ管理
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <button 
              onClick={handleOpenMessageEditor}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              📝 メッセージ編集
            </button>
            <button 
              onClick={handleOpenSettings}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0b7dda'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
            >
              ⚙️ テロップ設定
            </button>
            <button 
              onClick={handleOpenLogViewer}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e68900'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
            >
              📊 ログ表示
            </button>
            <button 
              onClick={handleOpenContentWindow}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7b1fa2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9C27B0'}
            >
              🎬 コンテンツ表示
            </button>
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            marginBottom: '15px',
            color: '#444',
            borderLeft: '4px solid #4CAF50',
            paddingLeft: '12px'
          }}>
            テロップ制御
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <button 
              onClick={handleToggleTeleop}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#da190b'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
            >
              🔄 ON/OFF切替
            </button>
            <button 
              onClick={() => window.electronAPI.pauseTeleop()}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#607D8B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#455a64'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#607D8B'}
            >
              ⏸️ 一時停止
            </button>
            <button 
              onClick={() => window.electronAPI.resumeTeleop()}
              style={{ 
                padding: '15px 20px', 
                fontSize: '16px', 
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              ▶️ 再開
            </button>
          </div>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#e8f5e9', 
          borderRadius: '8px',
          border: '1px solid #4CAF50'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#2e7d32' }}>
            ✅ 実装済み機能
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ メインウィンドウ</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ タスクトレイ機能</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ メニューバー</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ テロップバー</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ メッセージ管理</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ 設定カスタマイズ</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ ログ機能</p>
            <p style={{ margin: '5px 0', color: '#555' }}>✅ キーボードショートカット</p>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px',
          border: '1px solid #FF9800'
        }}>
          <p style={{ margin: 0, color: '#e65100', fontSize: '14px' }}>
            💡 <strong>ヒント:</strong> Ctrl+Shift+T でテロップのON/OFF、Ctrl+Shift+M でメッセージ編集を開けます
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainControl;
