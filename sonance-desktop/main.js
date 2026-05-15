const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const sidecar = require('./sidecar');

const forceDesktop = process.argv.includes('--desktop');
const isDev = !app.isPackaged && !forceDesktop;

let mainWindow;
let tray;

function getAppUrl() {
  if (isDev) {
    return 'http://localhost:17381';
  }
  return 'http://localhost:17380';
}

function sendMediaKey(key) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('media-key', key);
  }
}

function registerMediaKeys() {
  globalShortcut.register('MediaPlayPause', () => sendMediaKey('play-pause'));
  globalShortcut.register('MediaNextTrack', () => sendMediaKey('next'));
  globalShortcut.register('MediaPreviousTrack', () => sendMediaKey('previous'));
  globalShortcut.register('MediaStop', () => sendMediaKey('stop'));
}

function createTray() {
  const iconPath = path.join(__dirname, 'resources', 'tray-icon.png');
  let icon;
  try {
    icon = nativeImage.createFromPath(iconPath);
  } catch {
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon.isEmpty() ? nativeImage.createFromBuffer(Buffer.alloc(16 * 16 * 4, 128)) : icon);
  tray.setToolTip('Sonance');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Play/Pause', click: () => sendMediaKey('play-pause') },
    { label: 'Next', click: () => sendMediaKey('next') },
    { label: 'Previous', click: () => sendMediaKey('previous') },
    { type: 'separator' },
    { label: 'Show', click: () => { if (mainWindow) mainWindow.show(); } },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) mainWindow.show();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0f',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0a0f',
      symbolColor: '#e2e2e2',
      height: 32,
    },
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (!isDev) {
    try {
      await sidecar.start();
      console.log('[main] Sidecar ready, loading app');
    } catch (err) {
      console.error(`[main] Sidecar failed: ${err.message}`);
      app.quit();
      return;
    }
  }

  mainWindow.loadURL(getAppUrl());

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

ipcMain.on('set-titlebar-colors', (_event, bgColor, symbolColor) => {
  console.log('[main] setTitleBarOverlay called with bg:', bgColor, 'symbol:', symbolColor);
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      mainWindow.setTitleBarOverlay({
        color: bgColor,
        symbolColor: symbolColor,
        height: 32,
      });
    } catch (err) {
      console.error('[main] setTitleBarOverlay failed:', err.message);
    }
  }
});

app.whenReady().then(async () => {
  await createWindow();
  registerMediaKeys();
  createTray();
});

app.on('window-all-closed', async () => {
  await sidecar.stop();
  app.quit();
});

app.on('before-quit', async (event) => {
  if (sidecar.isRunning()) {
    event.preventDefault();
    await sidecar.stop();
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
