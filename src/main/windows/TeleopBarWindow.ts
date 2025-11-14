import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let teleopBarWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !process.defaultApp;

export function createTeleopBarWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  teleopBarWindow = new BrowserWindow({
    width: width,
    height: 40,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    teleopBarWindow.loadURL('http://localhost:5173/#/teleop-bar');
  } else {
    teleopBarWindow.loadFile(path.join(__dirname, '../../renderer/index.html'), {
      hash: 'teleop-bar',
    });
  }

  teleopBarWindow.setIgnoreMouseEvents(false);

  teleopBarWindow.on('closed', () => {
    teleopBarWindow = null;
  });

  return teleopBarWindow;
}

export function getTeleopBarWindow(): BrowserWindow | null {
  return teleopBarWindow;
}

export function closeTeleopBarWindow(): void {
  if (teleopBarWindow) {
    teleopBarWindow.close();
    teleopBarWindow = null;
  }
}

export function showTeleopBarWindow(): void {
  if (teleopBarWindow) {
    teleopBarWindow.show();
  } else {
    createTeleopBarWindow();
  }
}

export function hideTeleopBarWindow(): void {
  if (teleopBarWindow) {
    teleopBarWindow.hide();
  }
}
