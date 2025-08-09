// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const currentTime = document.getElementById('current-time');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const alertsContainer = document.getElementById('alerts');
const forecastContainer = document.getElementById('forecast');
const langEnBtn = document.getElementById('lang-en');
const langNeBtn = document.getElementById('lang-ne');
const autocomplete = document.getElementById('autocomplete');

// Config
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
const NEPALI_CITIES = [
    "Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", 
    "Birgunj", "Butwal", "Dharan", "Bhimdatta", "Hetauda",
    "Damak", "Bhaktapur", "Janakpur", "Nepalgunj", "Itahari",
    "Tulsipur", "Birendranagar", "Ghorahi", "Tilottama", "Kirtipur",
    "Tansen", "Rajbiraj", "Lahan", "Siddharthanagar", "Gulariya",
    "Everest Base Camp", "Annapurna Base Camp", "Mustang", "Chitwan", "Lumbini"
];

// Language support
const translations = {
    en: {
        searchPlaceholder: "Search city...",
        humidity: "Humidity",
        wind: "Wind",
        pressure: "Pressure",
        visibility: "Visibility",
        forecastTitle: "3-Day Forecast",
        footerText: "Data provided by OpenWeatherMap",
        footerProud: "Proudly made for Nepal",
        alerts: {
            monsoon: "⚠️ Monsoon Alert: Heavy rains expected in Terai region",
            mountain: "⚠️ Mountain Warning: Extreme conditions in Himalayas"
        }
    },
    ne: {
        searchPlaceholder: "शहर खोज्नुहोस्...",
        humidity: "आर्द्रता",
        wind: "हावा",
        pressure: "दबाब",
        visibility: "दृश्यता",
        forecastTitle: "३ दिने पूर्वानुमान",
        footerText: "OpenWeatherMap द्वारा डाटा प्रदान गरिएको",
        footerProud: "नेपालको लागि गर्वसाथ निर्मित",
        alerts: {
            monsoon: "⚠️ मनसुन चेतावनी: तराई क्षेत्रमा गहिरो वर्षाको सम्भावना",
            mountain: "⚠️ हिमालय चेतावनी: अत्यन्तै कठोर अवस्था"
        }
    }
};

let currentLanguage = 'en';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    setNepalTime();
    checkMonsoonAlert();
    checkMountainAlert();
    fetchWeather('Kathmandu');
    
    // Set up autocomplete
    cityInput.addEventListener('input', handleAutocomplete);
    
    // Event listeners
    searchBtn.addEventListener('click', () => {
        if (cityInput.value.trim()) {
            fetchWeather(cityInput.value.trim());
        }
    });
    
    locationBtn.addEventListener('click', getLocationWeather);
    
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cityInput.value.trim()) {
            fetchWeather(cityInput.value.trim());
        }
    });
    
    langEnBtn.addEventListener('click', () => {
        currentLanguage = 'en';
        updateLanguage();
    });
    
    langNeBtn.addEventListener('click', () => {
        currentLanguage = 'ne';
        updateLanguage();
    });
});

// Update UI language
function updateLanguage() {
    const lang = translations[currentLanguage];
    
    cityInput.placeholder = lang.searchPlaceholder;
    document.querySelector('.detail:nth-child(1) .label').textContent = lang.humidity;
    document.querySelector('.detail:nth-child(2) .label').textContent = lang.wind;
    document.querySelector('.detail:nth-child(3) .label').textContent = lang.pressure;
    document.querySelector('.detail:nth-child(4) .label').textContent = lang.visibility;
    document.querySelector('.forecast-container h3').textContent = lang.forecastTitle;
    document.querySelector('footer p:nth-child(1)').textContent = lang.footerText;
    document.querySelector('footer p:nth-child(2)').textContent = lang.footerProud;
    
    // Update alerts if they exist
    const monsoonAlert = document.querySelector('.alert.monsoon');
    if (monsoonAlert) {
        monsoonAlert.textContent = lang.alerts.monsoon;
    }
    
    const mountainAlert = document.querySelector('.alert.mountain');
    if (mountainAlert) {
        mountainAlert.textContent = lang.alerts.mountain;
    }
}

// Set Nepal time (UTC+5:45)
function setNepalTime() {
    const timeOptions = { 
        timeZone: 'Asia/Kathmandu', 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    
    const dateOptions = {
        timeZone: 'Asia/Kathmandu',
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    currentTime.textContent = new Date().toLocaleTimeString(currentLanguage === 'ne' ? 'ne-NP' : 'en-US', timeOptions);
    currentDate.textContent = new Date().toLocaleDateString(currentLanguage === 'ne' ? 'ne-NP' : 'en-US', dateOptions);
    
    // Update time every minute
    setInterval(() => {
        currentTime.textContent = new Date().toLocaleTimeString(currentLanguage === 'ne' ? 'ne-NP' : 'en-US', timeOptions);
    }, 60000);
}

// Check for monsoon season (June-Sept)
function checkMonsoonAlert() {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 8) { // June to September
        const alert = document.createElement('div');
        alert.className = 'alert monsoon';
        alert.textContent = translations[currentLanguage].alerts.monsoon;
        alertsContainer.appendChild(alert);
    }
}

// Check for mountain warnings (Everest region)
function checkMountainAlert() {
    // In a real app, you'd check an API for current conditions
    const alert = document.createElement('div');
    alert.className = 'alert mountain';
    alert.textContent = translations[currentLanguage].alerts.mountain;
    alertsContainer.appendChild(alert);
}

// Handle city autocomplete
function handleAutocomplete() {
    const input = cityInput.value.toLowerCase();
    if (input.length < 2) {
        autocomplete.style.display = 'none';
        return;
    }
    
    const matches = NEPALI_CITIES.filter(city => 
        city.toLowerCase().includes(input)
    );
    
    if (matches.length > 0) {
        autocomplete.innerHTML = '';
        matches.slice(0, 5).forEach(city => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = city;
            item.addEventListener('click', () => {
                cityInput.value = city;
                autocomplete.style.display = 'none';
                fetchWeather(city);
            });
            autocomplete.appendChild(item);
        });
        autocomplete.style.display = 'block';
    } else {
        autocomplete.style.display = 'none';
    }
}

// Get weather by geolocation
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            error => {
                alert(`Geolocation error: ${error.message}`);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

// Fetch weather by city name
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Location not found');
        }
        
        const data = await response.json();
        displayWeather(data);
        fetchForecast(lat, lon);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Fetch 3-day forecast
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=4`
        );
        
        if (!response.ok) {
            throw new Error('Forecast not available');
        }
        
        const data = await response.json();
        displayForecast(data.list);
    } catch (error) {
        console.error('Forecast error:', error);
    }
}

// Display current weather
function displayWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].main;
    
    // Update background based on weather
    document.body.className = '';
    if (data.weather[0].main.toLowerCase().includes('rain')) {
        document.body.classList.add('rainy');
    } else if (data.weather[0].main.toLowerCase().includes('cloud')) {
        document.body.classList.add('cloudy');
    }
}

// Display forecast
function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    
    // Skip today and get next 3 days
    for (let i = 1; i <= 3; i++) {
        const forecast = forecastData[i];
        const date = new Date(forecast.dt * 1000);
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const day = document.createElement('div');
        day.className = 'forecast-day';
        day.textContent = date.toLocaleDateString(currentLanguage === 'ne' ? 'ne-NP' : 'en-US', { weekday: 'short' });
        
        const icon = document.createElement('div');
        icon.className = 'forecast-icon';
        icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">`;
        
        const temp = document.createElement('div');
        temp.className = 'forecast-temp';
        temp.innerHTML = `
            <span>${Math.round(forecast.main.temp_max)}°</span>
            <span>${Math.round(forecast.main.temp_min)}°</span>
        `;
        
        forecastItem.appendChild(day);
        forecastItem.appendChild(icon);
        forecastItem.appendChild(temp);
        forecastContainer.appendChild(forecastItem);
    }
}
