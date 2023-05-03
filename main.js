const { app, BrowserWindow, ipcMain } = require('electron')
const { DOMParser } = require('xmldom');
const path = require('path')


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
}



app.whenReady().then(() => {
    ipcMain.handle('request-weather-update', fetchWeather);
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

async function parseWeatherText(text) {

    //TODO: handle improper text
    const start = text.indexOf("City of Edmonton - St. Albert - Sherwood Park.");
    const end = text.indexOf("Spruce Grove - Morinville - Mayerthorpe - Evansburg.");

    const forecast = text.substring(start, end);
    return forecast;

}

async function fetchWeather() {
    try {
        const response = await fetch('https://weather.gc.ca/forecast/public_bulletins_e.html?Bulletin=fpcn16.cwwg');
        const data = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const preElement = htmlDoc.getElementsByTagName('pre')[0];
        const parsedWeather = await parseWeatherText(preElement.textContent);
        return parsedWeather;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
