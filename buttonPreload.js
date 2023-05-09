const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('exit', {
  exit: async () => {
    console.log('prerender exit');
    ipcRenderer.invoke('exit');
  }
});

contextBridge.exposeInMainWorld('loadNewPicture', {
  loadNewPicture: async () => {
    ipcRenderer.invoke('loadNewPicture');
  }
});


