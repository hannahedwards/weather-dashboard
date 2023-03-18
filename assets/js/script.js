var cityEL = document.querySelector('#city');
var submitEL = document.querySelector('#submitButton');
var weatherEl = document.querySelector('#weather');
var forcastEL = document.querySelector('#forcast');
var apiKey = '7758d981f759fb9e8753ab618d08f57d';
var search;

function displayDay() {
    var date = dayjs().format('MMMM DD YYYY');
    return date;
};

var weatherSearch = function (event) {
    event.preventDefault();
    search = cityEL.value.trim();
    if (search) {
      coordinates(search);
    } else {
      window.alert('Oops! Enter city name please!');
    }
  };

function coordinates(city){
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey)
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {
    weatherEl.innerHTML = '';
    forcastEL.innerHTML = '';
    fetchWeatherData(data[0].lat, data[0].lon);
    fetchForcastData(data[0].lat, data[0].lon);
    })
};

function fetchWeatherData(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey)
    .then(function(resp) { return resp.json() }) 
    .then(function(data) {

      var todaysWeatherDivEL = document.createElement('div');
      todaysWeatherDivEL.classList.add("box");
      var todaysWeatherEL =document.createElement('h1');
      todaysWeatherEL.textContent = search + " (" + displayDay() + ") ";      
      
      var TempEL = document.createElement('p');
      var WindEL = document.createElement('p');
      var HumidityEL = document.createElement('p');

      TempEL.textContent = "Temp: " + data.main.temp + " °F";
      WindEL.textContent = "Wind: " + data.wind.speed + " mph";
      HumidityEL.textContent = "Humidity: " + data.main.humidity + " %";
      weatherEl.append(todaysWeatherEL);
      weatherEl.appendChild(TempEL);
      TempEL.appendChild(WindEL);
      WindEL.appendChild(HumidityEL);
    })
};

function fetchForcastData(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial&cnt=120")
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {

      for (let i = 0; i < 120; i += 8){

        var dailyWeatherDivEL = document.createElement('div');
        dailyWeatherDivEL.classList.add("box");
        var dailyWeatherEL = document.createElement('h1');

        dailyWeatherEL.textContent = dayjs(data.list[i].dt_txt).format('MMMM DD YYYY');    

        var dailyTempEL = document.createElement('p');
        var dailyWindEL = document.createElement('p');
        var dailyHumidityEL = document.createElement('p');
        dailyTempEL.textContent = "Temp: " + data.list[i].main.temp + " °F";
        dailyWindEL.textContent = "Wind: " + data.list[i].wind.speed + " mph";
        dailyHumidityEL.textContent = "Humidity: " + data.list[i].main.humidity + " %";

        forcastEL.append(dailyWeatherDivEL);
        dailyWeatherDivEL.append(dailyWeatherEL,dailyTempEL,dailyWindEL,dailyHumidityEL);
    };
    })
};

submitEL.addEventListener('click', weatherSearch);

init();