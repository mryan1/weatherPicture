const { app, BrowserWindow, ipcMain } = require('electron')
const { DOMParser } = require('xmldom');
require('dotenv').config();
const fetch = require('node-fetch');

const path = require('path')
const stability_url = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image'
const stability_api_key = process.env.STABILITY_API_KEY
const stability_prompt = `Create a picture to depict this weather forecast in Edmonton, Alberta, Canada during the month of ${new Date().toLocaleString('default', { month: 'long' })}. Landscape.  `;
const stability_neg_prompt = 'mountains';

const screenSize = {
    width: 800,
    height: 480
}

let win, buttonWindow;

function createWindow() {
    win = new BrowserWindow({
        width: screenSize.width,
        height: screenSize.height,
        frame: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    win.on('closed', () => {
        win = null;
    });
}

function createButtonWindow() {
    buttonWindow = new BrowserWindow({
        width: 400,
        height: 250,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        skipTaskbar: true,
        show: false,
        parent: win,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'buttonPreload.js')
        }
    });

    buttonWindow.loadFile('buttons.html');
}
function showMenu() {
    buttonWindow.show();
}

function hideMenu() {
    buttonWindow.hide();
}

app.whenReady().then(() => {
    ipcMain.handle('request-weather-update', fetchWeather);
    ipcMain.handle('generate-image', generateImage);
    //TODO: change these to ipcMain.on 
    ipcMain.handle('show-menu', showMenu);
    ipcMain.handle('hide-menu', hideMenu);
    ipcMain.handle('exit', () => app.quit());

    createWindow()
    createButtonWindow();

    win.webContents.on('did-finish-load', () => {
        ipcMain.handle('loadNewPicture', () => {
            console.log('loadNewPicture');
            win.webContents.send('loadNewPicture','test msg');
        });
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})



async function generateImage() {
    const weather = await fetchWeather();

    const artStyles = [
        '3d-model',
        'analog-film',
        'anime',
        'cinematic',
        'comic-book',
        'digital-art',
        'enhance fantasy-art',
        'isometric',
        'line-art',
        'low-poly',
        'modeling-compound',
        'neon-punk',
        'origami',
        'photographic',
        'pixel-art',
        'tile-texture'
    ];

    const response = await fetch(stability_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${stability_api_key}`
        },
        body: JSON.stringify({
            "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": 448,
            "sampler": "K_DPM_2_ANCESTRAL",
            "samples": 1,
            "seed": 0,
            "steps": 75,
            "style_preset": artStyles[Math.floor(Math.random() * artStyles.length)],
            "text_prompts": [
                {
                    "text": stability_prompt + weather,
                    "weight": 1
                },
                {
                    "text": stability_neg_prompt,
                    "weight": -.9
                }
            ],
            "width": 768
        })
    });
    const data = await response.json();
    return data;
}

async function parseWeatherText(text) {

    //TODO: handle improper text
    //const edmontonForecastRegex = /City of Edmonton - .*?\.\s*((Tonight|Today)\..*?\.)\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/gm;
    const edmontonForecastRegex = /City of Edmonton -.*\n((Today|Tonight).*\n*.*(?!Tonight\.*|Tomorrow\.*|Monday\.*|Tuesday\.*|Wednesday\.*|Thursday\.*)|Friday\.*|Saturday\.*|Sunday\.*)/gm;
    const edmontonForecastMatch = edmontonForecastRegex.exec(text);
    return edmontonForecastMatch[1];

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
