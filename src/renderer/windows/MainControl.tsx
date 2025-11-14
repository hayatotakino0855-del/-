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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teleop App - Control Panel</h1>
      <p>Version 0.1.0 - Phase 1: Basic Setup</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Windows</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <button 
            onClick={handleOpenMessageEditor}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Open Message Editor
          </button>
          <button 
            onClick={handleOpenSettings}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Open Teleop Settings
          </button>
          <button 
            onClick={handleOpenLogViewer}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Open Log Viewer
          </button>
          <button 
            onClick={handleOpenContentWindow}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Open Content Window
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Teleop Control</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <button 
            onClick={handleToggleTeleop}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Toggle Teleop ON/OFF
          </button>
          <button 
            onClick={() => window.electronAPI.pauseTeleop()}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Pause Teleop
          </button>
          <button 
            onClick={() => window.electronAPI.resumeTeleop()}
            style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
          >
            Resume Teleop
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Status</h3>
        <p>✅ Main window created</p>
        <p>✅ Task tray functionality</p>
        <p>✅ Menu bar implemented</p>
        <p>⏳ Phase 2-10 features coming soon...</p>
      </div>
    </div>
  );
};

export default MainControl;
