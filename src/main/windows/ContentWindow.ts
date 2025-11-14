import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentWindows: BrowserWindow[] = [];

export function createContentWindow(type: string, url: string): BrowserWindow {
  const contentWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    title: `Content: ${type}`,
  });

  if (type === 'video' || type === 'pdf' || type === 'spreadsheet') {
    contentWindow.loadURL(url);
  } else {
    contentWindow.loadURL(url);
  }

  contentWindow.on('closed', () => {
    const index = contentWindows.indexOf(contentWindow);
    if (index > -1) {
      contentWindows.splice(index, 1);
    }
  });

  contentWindows.push(contentWindow);

  return contentWindow;
}

export function getContentWindows(): BrowserWindow[] {
  return contentWindows;
}

export function closeAllContentWindows(): void {
  contentWindows.forEach((window) => {
    if (!window.isDestroyed()) {
      window.close();
    }
  });
  contentWindows.length = 0;
}
