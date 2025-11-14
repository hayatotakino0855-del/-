import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let settingsWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !process.defaultApp;

export function createSettingsWindow(): BrowserWindow {
  if (settingsWindow) {
    settingsWindow.focus();
    return settingsWindow;
  }

  settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Teleop Settings',
  });

  if (isDev) {
    settingsWindow.loadURL('http://localhost:5173/#/settings');
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../../renderer/index.html'), {
      hash: 'settings',
    });
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  return settingsWindow;
}

export function getSettingsWindow(): BrowserWindow | null {
  return settingsWindow;
}
