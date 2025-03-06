import { LightningElement, track } from 'lwc';
import getWeatherData from '@salesforce/apex/WebServiceLWC.getWeatherData';

export default class weatherForecase extends LightningElement {
    @track weather;
    @track error;

    connectedCallback() {
        this.getUserLocation();
    }

    // Fetch user's location dynamically
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    this.fetchWeather(latitude, longitude);
                },
                error => {
                    this.error = "Location access denied. Please enable location services.";
                }
            );
        } else {
            this.error = "Geolocation is not supported by this browser.";
        }
    }

    // Fetch weather data from Apex
    fetchWeather(lat, lon) {
    getWeatherData({ latitude: lat, longitude: lon })
        .then(response => {
            console.log('Weather API Response:', response);

            try {
                // Ensure response is not empty
                if (!response) {
                    throw new Error("Empty response from API");
                }

                const data = JSON.parse(response);
                console.log('Parsed Weather Data:', data);

                // Check if response contains an error
                if (data.cod && data.cod !== 200) {
                    throw new Error(`API Error: ${data.cod} - ${data.message}`);
                }

                this.weather = {
                    location: data.name || 'Unknown Location',
                    temperature: data.main?.temp || 'N/A',
                    condition: data.weather?.[0]?.description || 'N/A',
                    humidity: data.main?.humidity || 'N/A',
                    windSpeed: data.wind?.speed || 'N/A',
                    icon: data.weather?.[0]?.icon 
                        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
                        : ''
                };

            } catch (error) {
                console.error("Weather Data Parsing Error:", error);
                this.error = error.message || "Error fetching weather data.";
            }
        })
        .catch(error => {
            console.error("Weather API Fetch Error:", error);
            this.error = "Failed to fetch weather data.";
        });
}
}