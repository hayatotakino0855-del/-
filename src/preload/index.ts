import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getMessages: () => ipcRenderer.invoke('messages:get'),
  saveMessage: (message: any) => ipcRenderer.invoke('messages:save', message),
  updateMessage: (id: string, message: any) => ipcRenderer.invoke('messages:update', id, message),
  deleteMessage: (id: string) => ipcRenderer.invoke('messages:delete', id),
  
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),
  
  getLogs: () => ipcRenderer.invoke('logs:get'),
  addLog: (log: any) => ipcRenderer.invoke('logs:add', log),
  
  exportConfig: () => ipcRenderer.invoke('config:export'),
  importConfig: (config: any) => ipcRenderer.invoke('config:import', config),
  
  openMessageEditor: () => ipcRenderer.send('window:open-message-editor'),
  openSettings: () => ipcRenderer.send('window:open-settings'),
  openLogViewer: () => ipcRenderer.send('window:open-log-viewer'),
  openContentWindow: (type: string, url: string) => ipcRenderer.send('window:open-content', type, url),
  
  toggleTeleop: (enabled: boolean) => ipcRenderer.send('teleop:toggle', enabled),
  pauseTeleop: () => ipcRenderer.send('teleop:pause'),
  resumeTeleop: () => ipcRenderer.send('teleop:resume'),
  
  onMessagesUpdated: (callback: (messages: any[]) => void) => {
    ipcRenderer.on('messages:updated', (_event, messages) => callback(messages));
  },
  onSettingsUpdated: (callback: (settings: any) => void) => {
    ipcRenderer.on('settings:updated', (_event, settings) => callback(settings));
  },
});

export interface ElectronAPI {
  getMessages: () => Promise<any[]>;
  saveMessage: (message: any) => Promise<void>;
  updateMessage: (id: string, message: any) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<void>;
  getLogs: () => Promise<any[]>;
  addLog: (log: any) => Promise<void>;
  exportConfig: () => Promise<any>;
  importConfig: (config: any) => Promise<void>;
  openMessageEditor: () => void;
  openSettings: () => void;
  openLogViewer: () => void;
  openContentWindow: (type: string, url: string) => void;
  toggleTeleop: (enabled: boolean) => void;
  pauseTeleop: () => void;
  resumeTeleop: () => void;
  onMessagesUpdated: (callback: (messages: any[]) => void) => void;
  onSettingsUpdated: (callback: (settings: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
