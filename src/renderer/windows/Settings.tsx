import React, { useEffect, useState } from 'react';
import { TeleopSettings, createDefaultSettings } from '../../shared/models/Settings';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<TeleopSettings>(createDefaultSettings());
  const [activeTab, setActiveTab] = useState<'appearance' | 'animation' | 'display'>('appearance');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const teleopSettings = await window.electronAPI.getSettings();
      setSettings(teleopSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await window.electronAPI.saveSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      setSettings(createDefaultSettings());
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Teleop Settings</h1>
        <button
          onClick={() => window.close()}
          style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('appearance')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'appearance' ? '3px solid #4CAF50' : 'none',
            backgroundColor: 'transparent',
          }}
        >
          Appearance
        </button>
        <button
          onClick={() => setActiveTab('animation')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'animation' ? '3px solid #4CAF50' : 'none',
            backgroundColor: 'transparent',
          }}
        >
          Animation
        </button>
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
          Display
        </button>
      </div>

      {activeTab === 'appearance' && (
        <div>
          <h2>Appearance Settings</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Font Family:</label>
            <select
              value={settings.font.family}
              onChange={(e) => setSettings({ ...settings, font: { ...settings.font, family: e.target.value } })}
              style={{ width: '100%', padding: '10px', fontSize: '14px' }}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Font Size: {settings.font.size}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={settings.font.size}
              onChange={(e) => setSettings({ ...settings, font: { ...settings.font, size: parseInt(e.target.value) } })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Font Weight:</label>
            <select
              value={settings.font.weight}
              onChange={(e) => setSettings({ ...settings, font: { ...settings.font, weight: e.target.value as 'normal' | 'bold' } })}
              style={{ width: '100%', padding: '10px', fontSize: '14px' }}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Text Color:</label>
            <input
              type="color"
              value={settings.colors.text}
              onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, text: e.target.value } })}
              style={{ width: '100%', height: '40px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Background Color:</label>
            <input
              type="color"
              value={settings.colors.background}
              onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, background: e.target.value } })}
              style={{ width: '100%', height: '40px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Background Opacity: {Math.round(settings.colors.backgroundOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.colors.backgroundOpacity}
              onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, backgroundOpacity: parseFloat(e.target.value) } })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            <h3>Preview:</h3>
            <div
              style={{
                backgroundColor: `${settings.colors.background}${Math.floor(settings.colors.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
                color: settings.colors.text,
                fontFamily: settings.font.family,
                fontSize: `${settings.font.size}px`,
                fontWeight: settings.font.weight,
                padding: '20px',
                textAlign: 'center',
              }}
            >
              Sample Teleop Message
            </div>
          </div>
        </div>
      )}

      {activeTab === 'animation' && (
        <div>
          <h2>Animation Settings</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Scroll Speed: {settings.animation.speed} pixels/second
            </label>
            <input
              type="range"
              min="20"
              max="300"
              value={settings.animation.speed}
              onChange={(e) => setSettings({ ...settings, animation: { ...settings.animation, speed: parseInt(e.target.value) } })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Message Gap: {settings.animation.gap} pixels
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={settings.animation.gap}
              onChange={(e) => setSettings({ ...settings, animation: { ...settings.animation, gap: parseInt(e.target.value) } })}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {activeTab === 'display' && (
        <div>
          <h2>Display Settings</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Teleop Bar Height: {settings.display.height}px
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.display.height}
              onChange={(e) => setSettings({ ...settings, display: { ...settings.display, height: parseInt(e.target.value) } })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.display.alwaysOnTop}
                onChange={(e) => setSettings({ ...settings, display: { ...settings.display, alwaysOnTop: e.target.checked } })}
              />
              <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Always On Top</span>
            </label>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #ddd' }}>
        <button
          onClick={handleReset}
          style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
        >
          Reset to Defaults
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
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
