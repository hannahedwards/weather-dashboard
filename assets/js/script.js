var searchHistoryEL = document.querySelector('#searchHistory');
var searchCityInputEL = document.querySelector('#searchCity');
var submitEL = document.querySelector('#submit');
var currentWeatherEl = document.querySelector('#currentWeather');
var futureWeatherEL = document.querySelector('#futureWeather');
var listEL = document.createElement("ol");

var apiKey = "7758d981f759fb9e8753ab618d08f57d";
var apiSearchURL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}";
var searchCity;

function displayDay() {
    var today = dayjs().format('MMMM D');
    return today;
};

var submitWeatherSearch = function (event) {
    event.preventDefault();
  
    searchCity = searchCityInputEL.value.trim();
  
    if (searchCity) {
      // takes city name into api to get the lat/lon
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
    currentWeatherEl.innerHTML = '';
    futureWeatherEL.innerHTML = '';
    fetchCurrentWeatherData(data[0].lat, data[0].lon);
    fetchFutureWeatherData(data[0].lat, data[0].lon);
    })
};

function fetchCurrentWeatherData(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey)
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {

      var todaysWeatherEL = document.createElement('h4');
      var imgIconEL = document.createElement('img');

      todaysWeatherEL.textContent = searchCity + " (" + displayDay() + ") ";      
      todaysWeatherEL.appendChild(imgIconEL);
      currentWeatherEl.append(todaysWeatherEL);

      var currentTempEL = document.createElement('h4');
      var currentWindEL = document.createElement('h4');
      var currentHumidityEL = document.createElement('h4');

      currentTempEL.textContent = "Temp: " + data.main.temp + " °F";
      currentWindEL.textContent = "Wind: " + data.wind.speed + " mph";
      currentHumidityEL.textContent = "Humidity: " + data.main.humidity + " %";

      currentWeatherEl.appendChild(currentTempEL);
      currentTempEL.appendChild(currentWindEL);
      currentWindEL.appendChild(currentHumidityEL);
    })
};

function fetchFutureWeatherData(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial&cnt=120")
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {

      for (let i = 0; i < 120; i += 8){

        var dailyWeatherDivEL = document.createElement('div');
        dailyWeatherDivEL.classList.add("card");

        var dailyWeatherEL = document.createElement('h4');
        var imgIconEL = document.createElement('img');

        dailyWeatherEL.textContent = dayjs(data.list[i].dt_txt).format('MMMM D YYYY');
        dailyWeatherEL.append(imgIconEL);

        var dailyTempEL = document.createElement('h4');
        var dailyWindEL = document.createElement('h4');
        var dailyHumidityEL = document.createElement('h4');
        dailyTempEL.textContent = "Temp: " + data.list[i].main.temp + " °F";
        dailyWindEL.textContent = "Wind: " + data.list[i].wind.speed + " mph";
        dailyHumidityEL.textContent = "Humidity: " + data.list[i].main.humidity + " %";

        futureWeatherEL.append(dailyWeatherDivEL);
        dailyWeatherDivEL.append(dailyWeatherEL,dailyTempEL,dailyWindEL,dailyHumidityEL);
        dailyWeatherDivEL.classList.add("FiveDayCard");

    };
    })
};

function readHistoryFromStorage() {
    searchHistoryEL.innerHTML = '';

    var searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
    } else {
        searchHistory = [];
    };

    if (searchHistory.length < 10) {
      varLength = searchHistory.length;
    } else {
      varLength = 10;
    };

    for (var i = 0; i < varLength; i++){
      var liHistoryResult = document.createElement("li");
      liHistoryResult.textContent = searchHistory[i];
      liHistoryResult.classList.add("historyResults");
      searchHistoryEL.appendChild(liHistoryResult);
    };

    var li = document.getElementsByTagName("li");
    for(var i = 0;i<li.length;i++){
        li[i].addEventListener("click", function(event) {
          event.preventDefault();
          searchCity = this.innerText;
          fetchCoordinates(searchCity);
          readHistoryFromStorage();
        });

    };

    return searchHistory;
};

// this is saving the searched to local storage
function saveHistoryToStorage(searchHistory) {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

submitEL.addEventListener('click', submitWeatherSearch);
