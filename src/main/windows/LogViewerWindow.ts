import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let logViewerWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !process.defaultApp;

export function createLogViewerWindow(): BrowserWindow {
  if (logViewerWindow) {
    logViewerWindow.focus();
    return logViewerWindow;
  }

  logViewerWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Log Viewer',
  });

  if (isDev) {
    logViewerWindow.loadURL('http://localhost:5173/#/log-viewer');
  } else {
    logViewerWindow.loadFile(path.join(__dirname, '../../renderer/index.html'), {
      hash: 'log-viewer',
    });
  }

  logViewerWindow.on('closed', () => {
    logViewerWindow = null;
  });

  return logViewerWindow;
}

export function getLogViewerWindow(): BrowserWindow | null {
  return logViewerWindow;
}
