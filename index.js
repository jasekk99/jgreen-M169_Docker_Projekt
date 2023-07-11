const axios = require('axios');
const v3 = require('node-hue-api').v3;
const discovery = v3.discovery;
const hueApi = v3.api;
const apiKey = '**********';
const location = '***********';


axios
  .get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`)
  .then(response => {
    const weatherData = response.data;
    // Extract relevant information from weatherData
    // and control the Hue lights based on the weather conditions.
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });

  discovery.nupnpSearch()
  .then(searchResults => {
    const { ipaddress: ipAddress } = searchResults[0]; // Assuming only one bridge is found
    return hueApi.createLocal(ipAddress).connect();
  })
  .then(api => {
    // Control the Hue lights based on the weather data.
    // Use the `api` object to interact with the lights.
  })
  .catch(error => {
    console.error('Error connecting to the Hue bridge:', error);
  });

  // Extract relevant information from weatherData
const temperature = weatherData.current.temp_c;

// Define color values based on temperature
let color;
if (temperature < 10) {
  color = { hue: 46920, sat: 254 }; // Blue
} else if (temperature >= 10 && temperature < 20) {
  color = { hue: 25500, sat: 254 }; // Green
} else {
  color = { hue: 0, sat: 254 }; // Red
}

// Change the color of the Hue lights
api.lights.setLightState(1, { on: true, ...color })
  .then(result => {
    console.log('Light color changed successfully:', result);
  })
  .catch(error => {
    console.error('Error changing light color:', error);
  });
