

window.onload = async () => {
  // When the page loads, request an update to the weather forecast
  const weatherData = await window.api.fetchWeather();
  const forecastElement = document.getElementById('forecast');
  forecastElement.innerText = weatherData;
};
