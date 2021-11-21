let city
var cities= []
var searchBtn= ("#searchBtn")
var days= [1, 2, 3, 4, 5]

// function that handles the search button to read the value from the input and call the api from said value
function handleSearchBtn(city){
    city= $("#city-input").val();
    generateforecastCall(city);
    // if you write a different city down this will erase the previous choice
    var diffCity= $("#city-input").val();
    if (diffCity) {
        $("#weather-content").html("");
        $("#main-weather-content").html("");
        generatePastSearch(diffCity)
        cities.push(diffCity)
        console.log(cities)
        localStorage.setItem("search-history",  JSON.stringify(cities))
    }
}
// make the forecast call with city input
function generateforecastCall(city){
    // vars for api call
    var cityApi= "https://api.openweathermap.org/geo/1.0/direct?q="
    var limit = "&limit=1"
    var apiKey= "&appid=5007a0a32ea60284a90ed82d0aae0f00"
    // fetch the api then call a function 
    fetch(cityApi + city + limit + apiKey).then(function(response){
        // if the response of api call is ok make a json file so it is readable
        if (response.ok) {
            response.json().then(function(cityData){
                // then make a function assigning said data to a variable taking the elements of what I need in this case lat and lon
                console.log(cityData)
                var lat = cityData[0].lat
                var lon = cityData[0].lon
                // get current forecast
                // I found out that doing +var+ does the same thing as seperating the api call into values
                // this does the same thing as above but now calling a different api
              var forecastApi= "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=alerts,minutely&units=imperial&appid=5007a0a32ea60284a90ed82d0aae0f00"
              fetch(forecastApi).then(function(response){
                  if (response.ok) {
                      response.json().then(function (data){
                          console.log(data)
                          generateforecast(data)
                          generateCurrentDay(data)
                      })
                  }
              })
            })
        }
    })
            
}
// doing the same thing as the current day however we are putting all the
// elments and running them through a 5 day loop
// days come from the days array I have created
function generateforecast(data){
    $("#day-header").removeClass("hide")
for (let i = 0; i < days.length; i++) {
    var dailyWeather= data.daily[i].weather[0].main
    var dailyTemp= data.daily[i].temp.day
    var dailyWinds= data.daily[i].wind_speed
    var dailyHumidity= data.daily[i].humidity
    var dayHeader = $("<h2>").addClass("day-header").text("(" +moment().add(i+1, 'days').format('L')+")")
    var dayTemp = $("<li>").text("Temp: "+dailyTemp+"\u00B0"+"F")
    var dayWind = $("<li>").text("Wind: "+dailyWinds+" MPH")
    var dayHumidity = $("<li>").text("Humidity: "+dailyHumidity+"%")
    var dailyIcon = $("<i>")
    // using the same function in current day I am passing in the new icon variables
    // to make new icons for this
    generateIcons(dailyIcon, dailyWeather)
    var dayUl = $("<ul>").addClass("daily-ul").prepend(dayTemp, dayWind, dayHumidity)
    var day = $("<div>").addClass("day-box").prepend( dailyIcon, dayHeader, dayUl)
    $("#weather-content").append(day)
    
}
}
// generate the current weather by adding all the data gathered from the api call
// onto dynamically updated hmtl tags through js
function generateCurrentDay(data, city){
    $("#main-content-container").removeClass("hide")
    city= $("#city-input").val();
    var dayTemp = data.current.temp 
    var dayHumidity = data.current.humidity
    var dayWind = data.current.wind_speed
    var dayUv = data.current.uvi
    var currentDayTemp = $("<li>").text("Temp: "+dayTemp+"\u00B0"+"F")
    var currentDayWind = $("<li>").text("Wind: "+dayWind+" MPH")
    var currentDayHumidity = $("<li>").text("Humidity: "+dayHumidity+"%")
    var uvSpan = $("<span>").text(dayUv)
    var currentDayUv = $("<li>").text("UV Index: ").append(uvSpan)
    // set the uv index to favorable, moderate or severe
    if (dayUv<2.01) {
        $(uvSpan).addClass("uv-fav")
    } else if (uv<7){
        $(uvSpan).addClass("uv-mod")
    } else {
        $(uvSpan).addClass("uv-sev")
    }
    var currentDayUl = $("<ul>").addClass("current-day-ul").append(currentDayTemp, currentDayWind,currentDayHumidity, currentDayUv);
    var icon = $("<i>")
    generateIcons(icon, currentDayWeather)
    var currentDayWeather= data.current.weather[0].main
    // updateIcons(icon, weather)
    var currentDayHeader = $("<h2>").addClass("current-day-header").text(city + " (" +moment().format('L')+") ")
    $("#main-weather-content").append(icon, currentDayHeader, currentDayUl)
}
// uses open weather's icons to display icons depending on the weather status
function generateIcons (icon, currentDayWeather){
    if (currentDayWeather=== "Clouds") {
        $(icon).html("<img src=http://openweathermap.org/img/w/03d.png>")
    } else if (currentDayWeather=== "Rain") {
        $(icon).html("<img src=http://openweathermap.org/img/w/10d.png>")
    } else if (currentDayWeather=== "Snow") {
        $(icon).html("<img src=http://openweathermap.org/img/w/13d.png>")
    } else if (currentDayWeather=== "Drizzle") {
        $(icon).html("<img src=http://openweathermap.org/img/w/09d.png>")
    } else if (currentDayWeather=== "Thunderstorm") {
        $(icon).html("<img src=http://openweathermap.org/img/w/11d.png>")
    } else if (currentDayWeather=== "Clear") {
        $(icon).html("<img src=http://openweathermap.org/img/w/01d.png>")
    } else {
        $(icon).html("<img src=http://openweathermap.org/img/w/50d.png>")
    }
}
// function to see what user has wrote previously
function generatePastSearch(city){
var pastCity= $("<p>").addClass("past-search").text(city)
$("#sidebar-container").append(pastCity)
}
// makes sure to get saved city that adds as much cities as a user typed
let searchHistory= JSON.parse(localStorage.getItem("search-history"))
if (searchHistory) {
    cities= searchHistory
    for (let i = 0; i < cities.length; i++) {
        var pastCity= cities[i]
        generatePastSearch(pastCity)
    }
}