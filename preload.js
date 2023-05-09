const { contextBridge, ipcRenderer } = require('electron');

// Expose the `fetchWeather` function to the renderer process
contextBridge.exposeInMainWorld('api', {
  fetchWeather: async () => {
    try {
      const weatherData = await ipcRenderer.invoke('request-weather-update');
      return weatherData;
    } catch (error) {
      console.error(error);
    }
  },
});

contextBridge.exposeInMainWorld('stability', {
  generateImage: async () => {
    try {
      const imageData = await ipcRenderer.invoke('generate-image');
      return imageData;
    } catch (error) {
      console.error(error);
    }
  }
});

//TODO: combine these under one 'menu' api
contextBridge.exposeInMainWorld('showMenu', {
  showMenu: async () => {
    ipcRenderer.invoke('show-menu');
  }
});

contextBridge.exposeInMainWorld('hideMenu', {
  hideMenu: async () => {
    ipcRenderer.invoke('hide-menu');
  }
});


// listen for the message from the main process
// https://www.electronjs.org/docs/latest/tutorial/ipc#2-expose-ipcrendereron-via-preload

contextBridge.exposeInMainWorld('electronAPI', {
  onLoadNewPicture: (callback) => ipcRenderer.on('loadNewPicture', callback)
})