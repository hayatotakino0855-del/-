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
      alert('設定を保存しました！');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('設定の保存に失敗しました');
    }
  };

  const handleReset = () => {
    if (confirm('デフォルト設定にリセットしてもよろしいですか？')) {
      setSettings(createDefaultSettings());
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
        maxWidth: '900px',
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
            borderBottom: '3px solid #2196F3',
            paddingBottom: '10px'
          }}>
            ⚙️ テロップ設定
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
            onClick={() => setActiveTab('appearance')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'appearance' ? '3px solid #2196F3' : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'appearance' ? 'bold' : 'normal',
              color: activeTab === 'appearance' ? '#2196F3' : '#666'
            }}
          >
            🎨 外観
          </button>
          <button
            onClick={() => setActiveTab('animation')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'animation' ? '3px solid #2196F3' : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'animation' ? 'bold' : 'normal',
              color: activeTab === 'animation' ? '#2196F3' : '#666'
            }}
          >
            🎬 アニメーション
          </button>
          <button
            onClick={() => setActiveTab('display')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'display' ? '3px solid #2196F3' : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'display' ? 'bold' : 'normal',
              color: activeTab === 'display' ? '#2196F3' : '#666'
            }}
          >
            📺 表示
          </button>
        </div>

      {activeTab === 'appearance' && (
        <div>
          <h2 style={{ fontSize: '22px', marginBottom: '25px', color: '#444', borderLeft: '4px solid #2196F3', paddingLeft: '12px' }}>
            外観設定
          </h2>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>フォント種類:</label>
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
              文字サイズ: {settings.font.size}px
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>文字の太さ:</label>
            <select
              value={settings.font.weight}
              onChange={(e) => setSettings({ ...settings, font: { ...settings.font, weight: e.target.value as 'normal' | 'bold' } })}
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px' }}
            >
              <option value="normal">標準</option>
              <option value="bold">太字</option>
            </select>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>文字色:</label>
            <input
              type="color"
              value={settings.colors.text}
              onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, text: e.target.value } })}
              style={{ width: '100%', height: '40px' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>背景色:</label>
            <input
              type="color"
              value={settings.colors.background}
              onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, background: e.target.value } })}
              style={{ width: '100%', height: '40px' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
              背景の透明度: {Math.round(settings.colors.backgroundOpacity * 100)}%
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

          <div style={{ padding: '25px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '2px solid #2196F3' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#1976d2' }}>👁️ プレビュー:</h3>
            <div
              style={{
                backgroundColor: `${settings.colors.background}${Math.floor(settings.colors.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
                color: settings.colors.text,
                fontFamily: settings.font.family,
                fontSize: `${settings.font.size}px`,
                fontWeight: settings.font.weight,
                padding: '25px',
                textAlign: 'center',
                borderRadius: '6px'
              }}
            >
              サンプルテロップメッセージ
            </div>
          </div>
        </div>
      )}

      {activeTab === 'animation' && (
        <div>
          <h2 style={{ fontSize: '22px', marginBottom: '25px', color: '#444', borderLeft: '4px solid #2196F3', paddingLeft: '12px' }}>
            アニメーション設定
          </h2>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
              スクロール速度: {settings.animation.speed} ピクセル/秒
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
              メッセージ間隔: {settings.animation.gap} ピクセル
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
          <h2 style={{ fontSize: '22px', marginBottom: '25px', color: '#444', borderLeft: '4px solid #2196F3', paddingLeft: '12px' }}>
            表示設定
          </h2>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>
              テロップバーの高さ: {settings.display.height}px
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.display.alwaysOnTop}
                onChange={(e) => setSettings({ ...settings, display: { ...settings.display, alwaysOnTop: e.target.checked } })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ marginLeft: '12px', fontWeight: 'bold', fontSize: '16px', color: '#555' }}>常に最前面に表示</span>
            </label>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', paddingTop: '25px', borderTop: '2px solid #ddd' }}>
        <button
          onClick={handleReset}
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
          🔄 デフォルトに戻す
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          💾 設定を保存
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Settings;
