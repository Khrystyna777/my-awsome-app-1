const apiKey = "6d6707158d984d7aae5111721242910"; 
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("search-input");
const currentCity = document.getElementById("current-city");
const currentTemperature = document.getElementById("current-temperature");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const weatherDescription = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-icon");
const forecastElement = document.getElementById("weekly-forecast");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = cityInput.value;
  getWeather(city);
});

function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  axios
    .get(url)
    .then((response) => {
      const { temp_c, condition } = response.data.current;
      const { name } = response.data.location;

      currentCity.innerText = name;
      currentTemperature.innerText = Math.round(temp_c);
      humidityElement.innerText = `${response.data.current.humidity}%`;
      windElement.innerText = `${response.data.current.wind_kph} km/h`;
      weatherDescription.innerText = condition.text;

      updateWeatherIcon(condition);
      getWeeklyForecast(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Could not retrieve weather data. Please check the city name.");
    });
}

function getWeeklyForecast(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

  axios
    .get(url)
    .then((response) => {
      const daily = response.data.forecast.forecastday;
      displayWeeklyForecast(daily);
    })
    .catch((error) => {
      console.error("Error fetching weekly forecast:", error);
    });
}

function displayWeeklyForecast(daily) {
  forecastElement.innerHTML = "";
  const daysToShow = daily.slice(0, 5); 

  daysToShow.forEach((day) => {
    
    console.log(day.day.condition); 

    const date = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const temp = Math.round(day.day.avgtemp_c);
    const icon = getWeatherIcon(day.day.condition); 

    forecastElement.innerHTML += `
            <div class="forecast-day">
                <div>${date}</div>
                <div class="forecast-icon">${icon}</div>
                <div>${temp}°C</div>
            </div>`;
  });
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    "Partly Cloudy": "🌤️",  
    Overcast: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Mist: "🌫️",
    Drizzle: "🌦️",
    "Heavy rain": "🌧️",
    "Light rain": "🌧️",
    "Heavy snow": "❄️",
    "Light snow": "❄️",
    Fog: "🌁",
    Windy: "💨",
    "Patchy rain nearby": "🌧️", 
    "Patchy snow": "❄️",
  };
  return icons[condition.text.trim()] || "☁️";
} 

function updateWeatherIcon(condition) {
  const iconElement = document.querySelector(".current-temperature-icon");
  iconElement.innerText = getWeatherIcon(condition);
}

window.onload = () => getWeather("Paris");
