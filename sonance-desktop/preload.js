const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  onMediaKey: (callback) => ipcRenderer.on('media-key', (_event, key) => callback(key)),
  setTitleBarColors: (bgColor, symbolColor) => ipcRenderer.send('set-titlebar-colors', bgColor, symbolColor),
});
