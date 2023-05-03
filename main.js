const { app, BrowserWindow } = require('electron')
const { DOMParser } = require('xmldom');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

async function parseWeatherText(text) {
    const start = text.indexOf("City of Edmonton - St. Albert - Sherwood Park.");
    const end = text.indexOf("Spruce Grove - Morinville - Mayerthorpe - Evansburg.");

    const forecast = text.substring(start, end);

    console.log(forecast);

}

app.on('ready', () => {
    fetch('https://weather.gc.ca/forecast/public_bulletins_e.html?Bulletin=fpcn16.cwwg')
        .then(response => response.text())
        .then(data => {
            // Parse the text data as HTML using xmldom
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            // Extract the contents of the <pre> tag, if present
            const preElement = htmlDoc.getElementsByTagName('pre')[0];
            //console.log(preElement.textContent)
            parseWeatherText(preElement.textContent)
        })
        .catch(error => {
            console.error(error);
        });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
