import { Message } from './Message';
import { TeleopSettings } from './Settings';
import { DisplayLog, ChangeLog } from './Log';

export interface AppConfig {
  version: string;
  messages: Message[];
  teleopSettings: TeleopSettings;
  displayLogs: DisplayLog[];
  changeLogs: ChangeLog[];
  lastExportPath?: string;
}

export function createDefaultAppConfig(): AppConfig {
  return {
    version: '1.0.0',
    messages: [],
    teleopSettings: {
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
    displayLogs: [],
    changeLogs: [],
  };
}
