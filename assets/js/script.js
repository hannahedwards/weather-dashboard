var weatherEl = document.querySelector('#weather')
var weatherForcastEl = document.querySelector('#weatherForcast')
var cityEl = document.querySelector('#city')
var searchEl = document.querySelector('#search')
var historyEl = document.querySelector('#history')
var apiKey = "7758d981f759fb9e8753ab618d08f57d";
var apiSearchURL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}";
var searchCity;

function day() {
var today = day().format('MMMM D');
return today;
};

var currentWeatherSearch = function (event) {
  event.preventDefault();

  searchCity = cityEl.value.trim();

  if (searchCity) {
    fetchCoordinates(searchCity);
    var searchHistory = readHistoryFromStorage();
    searchHistory.push(searchCity);
    saveHistoryToStorage(searchHistory);
    readHistoryFromStorage();
  }
};

function fetchCoordinates(cityName){
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey)
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
    fetchCurrentWeatherData(data[0].lat, data[0].lon);
    fetchFutureWeatherData(data[0].lat, data[0].lon);
    })
};

function fetchCurrentWeatherData(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey)
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {

      var todaysWeatherEL = document.createElement('h4');

      todaysWeatherEL.textContent = searchCity 
      ;      
      weatherEl.append(todaysWeatherEL);

      var currentTempEL = document.createElement('h4');
      var currentWindEL = document.createElement('h4');
      var currentHumidityEL = document.createElement('h4');

      currentTempEL.textContent = "Temp: " + data.main.temp + " °F";
      currentWindEL.textContent = "Wind: " + data.wind.speed + " mph";
      currentHumidityEL.textContent = "Humidity: " + data.main.humidity + " %";

      weatherEl.appendChild(currentTempEL);
      currentTempEL.appendChild(currentWindEL);
      currentWindEL.appendChild(currentHumidityEL);
    })
};

function saveHistoryToStorage(searchHistory) {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

searchEL.addEventListener('click', currentWeatherSearch);
