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
      console.log('in preload: ' + imageData);
      return imageData;
    } catch (error) {
      console.error(error);
    }
  }});
  
  
  
