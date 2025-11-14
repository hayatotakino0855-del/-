import Store from 'electron-store';
import { AppConfig } from '../shared/models/AppConfig.js';

const schema = {
  version: {
    type: 'string',
    default: '1.0.0',
  },
  messages: {
    type: 'array',
    default: [],
  },
  teleopSettings: {
    type: 'object',
    default: {
      version: '1.0.0',
      font: {
        family: 'Arial',
        size: 24,
        weight: 'normal',
      },
      colors: {
        text: '#FFFFFF',
        background: '#000000',
        backgroundOpacity: 0.8,
      },
      animation: {
        speed: 100,
        gap: 50,
      },
      display: {
        height: 40,
        alwaysOnTop: true,
      },
    },
  },
  displayLogs: {
    type: 'array',
    default: [],
  },
  changeLogs: {
    type: 'array',
    default: [],
  },
  lastExportPath: {
    type: 'string',
  },
};

export const store = new Store<AppConfig>({
  schema: schema as any,
  name: 'teleop-config',
});

export function getConfig(): AppConfig {
  return {
    version: store.get('version', '1.0.0'),
    messages: store.get('messages', []),
    teleopSettings: store.get('teleopSettings'),
    displayLogs: store.get('displayLogs', []),
    changeLogs: store.get('changeLogs', []),
    lastExportPath: store.get('lastExportPath'),
  };
}

export function saveConfig(config: Partial<AppConfig>): void {
  if (config.version !== undefined) store.set('version', config.version);
  if (config.messages !== undefined) store.set('messages', config.messages);
  if (config.teleopSettings !== undefined) store.set('teleopSettings', config.teleopSettings);
  if (config.displayLogs !== undefined) store.set('displayLogs', config.displayLogs);
  if (config.changeLogs !== undefined) store.set('changeLogs', config.changeLogs);
  if (config.lastExportPath !== undefined) store.set('lastExportPath', config.lastExportPath);
}
