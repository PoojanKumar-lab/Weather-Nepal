// You'll need to use a weather API like OpenWeatherMap
document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    // Replace with actual API call
    console.log(`Fetching weather for ${city}`);
    
    // Mock data for now
    const mockData = {
        name: city,
        main: {
            temp: 22,
            humidity: 65
        },
        weather: [{
            description: "Partly cloudy",
            icon: "02d"
        }],
        wind: {
            speed: 12
        }
    };
    
    displayWeather(mockData);
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} km/h`;
    
    // For real API, you'd set the icon source like:
    // document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}