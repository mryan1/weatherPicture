const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('exit', {
  exit: async () => {
    console.log('prerender exit');
    ipcRenderer.invoke('exit');
  }
}); 
