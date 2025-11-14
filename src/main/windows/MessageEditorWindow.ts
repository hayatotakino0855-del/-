import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let messageEditorWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !process.defaultApp;

export function createMessageEditorWindow(): BrowserWindow {
  if (messageEditorWindow) {
    messageEditorWindow.focus();
    return messageEditorWindow;
  }

  messageEditorWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Message Editor',
  });

  if (isDev) {
    messageEditorWindow.loadURL('http://localhost:5173/#/message-editor');
  } else {
    messageEditorWindow.loadFile(path.join(__dirname, '../../renderer/index.html'), {
      hash: 'message-editor',
    });
  }

  messageEditorWindow.on('closed', () => {
    messageEditorWindow = null;
  });

  return messageEditorWindow;
}

export function getMessageEditorWindow(): BrowserWindow | null {
  return messageEditorWindow;
}
