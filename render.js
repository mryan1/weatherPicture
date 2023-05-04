

window.onload = async () => {
    // When the page loads, request an update to the weather forecast
    const weatherData = await window.api.fetchWeather();
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerText = weatherData;

    const imgElement = document.createElement('img');
    const weatherImage = await window.stability.generateImage();
    const base64ImageData = weatherImage.artifacts[0].base64
    imgElement.src = 'data:image/png;base64,' + base64ImageData;
    document.body.appendChild(imgElement);

    setInterval(async () => {
        const weatherImage = await window.stability.generateImage();
        const base64ImageData = weatherImage.artifacts[0].base64
        imgElement.src = 'data:image/png;base64,' + base64ImageData;
    },  3600000); 

    setInterval(async () => {
        const weatherData = await window.api.fetchWeather();
        forecastElement.innerText = weatherData;
    }, 3600000); // update every hour (in milliseconds)

};
