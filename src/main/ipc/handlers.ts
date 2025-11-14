import { ipcMain } from 'electron';
import { getConfig, saveConfig } from '../storage.js';
import { Message } from '../../shared/models/Message.js';
import { TeleopSettings } from '../../shared/models/Settings.js';
import { DisplayLog, ChangeLog } from '../../shared/models/Log.js';
import { AppConfig } from '../../shared/models/AppConfig.js';

export function setupIpcHandlers() {
  ipcMain.handle('messages:get', async () => {
    const config = getConfig();
    return config.messages;
  });

  ipcMain.handle('messages:save', async (_event, message: Message) => {
    const config = getConfig();
    config.messages.push(message);
    saveConfig({ messages: config.messages });
  });

  ipcMain.handle('messages:update', async (_event, id: string, message: Message) => {
    const config = getConfig();
    const index = config.messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      config.messages[index] = { ...message, updatedAt: new Date().toISOString() };
      saveConfig({ messages: config.messages });
    }
  });

  ipcMain.handle('messages:delete', async (_event, id: string) => {
    const config = getConfig();
    config.messages = config.messages.filter((m) => m.id !== id);
    saveConfig({ messages: config.messages });
  });

  ipcMain.handle('settings:get', async () => {
    const config = getConfig();
    return config.teleopSettings;
  });

  ipcMain.handle('settings:save', async (_event, settings: TeleopSettings) => {
    saveConfig({ teleopSettings: settings });
  });

  ipcMain.handle('logs:get', async () => {
    const config = getConfig();
    return {
      displayLogs: config.displayLogs,
      changeLogs: config.changeLogs,
    };
  });

  ipcMain.handle('logs:add', async (_event, log: DisplayLog | ChangeLog) => {
    const config = getConfig();
    if ('messageId' in log) {
      config.displayLogs.push(log as DisplayLog);
      saveConfig({ displayLogs: config.displayLogs });
    } else {
      config.changeLogs.push(log as ChangeLog);
      saveConfig({ changeLogs: config.changeLogs });
    }
  });

  ipcMain.handle('config:export', async () => {
    return getConfig();
  });

  ipcMain.handle('config:import', async (_event, config: AppConfig) => {
    saveConfig(config);
  });

  ipcMain.on('window:open-message-editor', async () => {
    const { createMessageEditorWindow } = await import('../windows/MessageEditorWindow.js');
    createMessageEditorWindow();
  });

  ipcMain.on('window:open-settings', async () => {
    const { createSettingsWindow } = await import('../windows/SettingsWindow.js');
    createSettingsWindow();
  });

  ipcMain.on('window:open-log-viewer', async () => {
    const { createLogViewerWindow } = await import('../windows/LogViewerWindow.js');
    createLogViewerWindow();
  });

  ipcMain.on('window:open-content', async (_event, type: string, url: string) => {
    const { createContentWindow } = await import('../windows/ContentWindow.js');
    createContentWindow(type, url);
  });

  ipcMain.on('teleop:toggle', (_event, enabled: boolean) => {
    console.log('TODO: Toggle teleop', enabled);
  });

  ipcMain.on('teleop:pause', () => {
    console.log('TODO: Pause teleop');
  });

  ipcMain.on('teleop:resume', () => {
    console.log('TODO: Resume teleop');
  });
}
