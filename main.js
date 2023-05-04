const { app, BrowserWindow, ipcMain } = require('electron')
const { DOMParser } = require('xmldom');
require('dotenv').config();

const path = require('path')
const stability_url = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image'
const stability_api_key = process.env.STABILITY_API_KEY
const stability_prompt = `Create a picture to depict this weather forecast for Edmonton, Alberta, Canada in ${new Date().toLocaleString('default', { month: 'long' })}. `;
const stability_neg_prompt = 'mountains';

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 480,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
}



app.whenReady().then(() => {
    ipcMain.handle('request-weather-update', fetchWeather);
    ipcMain.handle('generate-image', generateImage);
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

async function generateImage() {
    const weather = await fetchWeather();
    console.log("Prompt ", stability_prompt + weather);

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
    //console.log(data);
    return data;
}

async function parseWeatherText(text) {

    //TODO: handle improper text
    const edmontonForecastRegex = /City of Edmonton - .*?\.\s*((Tonight|Today)\..*?\.)\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/gm;
    const edmontonForecastMatch = edmontonForecastRegex.exec(text);
    
    console.log(edmontonForecastMatch[1]);

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
