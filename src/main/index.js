import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;
let tray = null;
let isQuitting = false;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: 'Teleop App - Control Panel',
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });
}
function createTray() {
    const icon = nativeImage.createEmpty();
    icon.addRepresentation({
        width: 16,
        height: 16,
        buffer: Buffer.from([]),
    });
    tray = new Tray(icon);
    tray.setToolTip('Teleop App');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show Control Panel',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
                else {
                    createMainWindow();
                }
            },
        },
        {
            label: 'Teleop ON/OFF',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => {
                console.log('Teleop toggled:', menuItem.checked);
            },
        },
        { type: 'separator' },
        {
            label: 'Message Editor',
            click: () => {
                console.log('Open message editor');
            },
        },
        {
            label: 'Settings',
            click: () => {
                console.log('Open settings');
            },
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            }
            else {
                mainWindow.show();
                mainWindow.focus();
            }
        }
        else {
            createMainWindow();
        }
    });
}
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Export Settings',
                    click: () => {
                        console.log('Export settings');
                    },
                },
                {
                    label: 'Import Settings',
                    click: () => {
                        console.log('Import settings');
                    },
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    click: () => {
                        isQuitting = true;
                        app.quit();
                    },
                },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Message Editor',
                    click: () => {
                        console.log('Open message editor');
                    },
                },
                {
                    label: 'Teleop Settings',
                    click: () => {
                        console.log('Open settings');
                    },
                },
                {
                    label: 'Log Viewer',
                    click: () => {
                        console.log('Open log viewer');
                    },
                },
                { type: 'separator' },
                {
                    label: 'Open Content Window',
                    click: () => {
                        console.log('Open content window');
                    },
                },
            ],
        },
        {
            label: 'Teleop',
            submenu: [
                {
                    label: 'ON/OFF',
                    type: 'checkbox',
                    checked: true,
                    click: (menuItem) => {
                        console.log('Teleop toggled:', menuItem.checked);
                    },
                },
                {
                    label: 'Pause/Resume',
                    click: () => {
                        console.log('Pause/Resume teleop');
                    },
                },
            ],
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        console.log('About Teleop App v0.1.0');
                    },
                },
            ],
        },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
app.whenReady().then(() => {
    createMainWindow();
    createTray();
    createMenu();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});
app.on('window-all-closed', () => {
});
app.on('before-quit', () => {
    isQuitting = true;
});
