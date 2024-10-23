//document.querySelector("#submitBtn").addEventListener("click", populateWeather);
document.querySelector("#submitcurrent").addEventListener("click", switchToCurrent);
document.querySelector("#submitday").addEventListener("click", switchToDay);
document.querySelector("#submitfull").addEventListener("click", switchToFull);


//API Variables: 
let key = "bdce6144fd068f935b7a4d78c610dc2a";
let urlbaseWeatherCurrent = "https://api.openweathermap.org/data/2.5/weather?"
let urlbaseWeatherHourly = "https://api.openweathermap.org/data/2.5/forecast?";
let urlbaseWeatherDaily = "https://api.openweathermap.org/data/2.5/forecast?";
let urlbaseGeo = "https://api.openweathermap.org/geo/1.0/"

//Global Variables: 
let type = "current";
let previousURL = "";

//function to switch display to the current weather information
function switchToCurrent() {
  if(type != "current") {
    type = "current";
    //Set Current
      document.querySelector("#current").style.borderLeft = "1px solid black";
      document.querySelector("#current").style.borderRight = "1px solid black";
      document.querySelector("#current").style.borderTop = "1px solid black";
      document.querySelector("#current").style.backgroundColor = "white";
    //Set Day
      document.querySelector("#dayforecast").style.border = "none";
      document.querySelector("#dayforecast").style.backgroundColor = "#f2f2f2";
    //Set Full
      document.querySelector("#fullforecast").style.border = "none";
      document.querySelector("#fullforecast").style.backgroundColor = "#f2f2f2";
    if(previousURL != "") {
      populateWeather();
    }
  }
}

//function to switch display to daily forecast
function switchToDay() {
  if(type != "hourly") {
    type = "hourly";
    //Set Current
      document.querySelector("#dayforecast").style.borderLeft = "1px solid black";
      document.querySelector("#dayforecast").style.borderRight = "1px solid black";
      document.querySelector("#dayforecast").style.borderTop = "1px solid black";
      document.querySelector("#dayforecast").style.backgroundColor = "white";
    //Set Day
      document.querySelector("#current").style.border = "none";
      document.querySelector("#current").style.backgroundColor = "#f2f2f2";
    //Set Full
      document.querySelector("#fullforecast").style.border = "none";
      document.querySelector("#fullforecast").style.backgroundColor = "#f2f2f2";
    if(previousURL != "") {
      populateWeather();
    }
  }
}

//Function to swith display to full forecast
function switchToFull() {
  if(type != "daily") {
    type = "daily";
    //Set Current
      document.querySelector("#fullforecast").style.borderLeft = "1px solid black";
      document.querySelector("#fullforecast").style.borderRight = "1px solid black";
      document.querySelector("#fullforecast").style.borderTop = "1px solid black";
      document.querySelector("#fullforecast").style.backgroundColor = "white";
    //Set Day
      document.querySelector("#current").style.border = "none";
      document.querySelector("#current").style.backgroundColor = "#f2f2f2";
    //Set Full
      document.querySelector("#dayforecast").style.border = "none";
      document.querySelector("#dayforecast").style.backgroundColor = "#f2f2f2";
    //Refresh URL
      if(previousURL != "") {
        populateWeather();
      }
  }
}

//helper function to create a geo URL from the base URL and city/state
function createGeoUrlCity(city, state, country) {
  return urlbaseGeo + "direct?q=" + city + "," + state + "," + country + "&limit=1" + "&appid=" + key;
}

//helper function to create the geo URL from the base URL and Zip
function createGeoUrlZip(zip, country) {
  return urlbaseGeo + "zip?zip=" + zip + "," + country + "&appid=" + key;
}

//Create a wheather URL based on the base URL, type, and specific information required
function createWeatherUrl(type, lat, lon) {
  switch (type) {
    case "current":
      return urlbaseWeatherCurrent + "lat=" + lat + "&lon=" + lon + "&units=imperial" +  "&appid=" + key;
    case "hourly":
      return urlbaseWeatherHourly + "lat=" + lat + "&lon=" + lon + "&units=imperial" + "&cnt=12" + "&appid=" + key;
    case "daily":
      return urlbaseWeatherDaily + "lat=" + lat + "&lon=" + lon + "&units=imperial" + "&cnt=40" + "&appid=" + key;
    default: 
      return "";
  }
}

//Create a weather API link from the zip and query type
async function createLinkFromZip(zip, type) {
  let link = createGeoUrlZip(zip, "US");
  console.log(link);
  let response = await fetch(link);
  let data = await response.json();
  if(data.hasOwnProperty("name")) {
    let lat = data.lat;
    let lon = data.lon;
    let weatherLink = createWeatherUrl(type, lat, lon);
    console.log(weatherLink);
    return weatherLink;
  } else {
    return "";
  }
}

//Create a weather API link from the city and query type
async function createLinkFromCity(city, type) {
  let state = city.split(",")[1].replace(" ","");
  city = city.split(",")[0];
  let link = createGeoUrlCity(city, state, "US");
  console.log(link);
  let response = await fetch(link);
  let data = await response.json();
  if(data[0].hasOwnProperty("name")) {
    let lat = data[0].lat;
    let lon = data[0].lon;
    let weatherLink = createWeatherUrl(type, lat, lon);
    console.log(weatherLink);
    return weatherLink;
  } else {
    return "";
  }
}

//validate the input is correct and determine the type
function validateInput(input) {
  if(input.length == 0) {
    return "undefined";
  } else if(input.length == 5 && input.match(/^[0-9]+$/)) {
    return "zip";
  } else if(input.includes(",")) {
    return "city";
  }
  return "undefined";
}

// Primary driver function to populate weather information
async function populateWeather() {
  let input = document.querySelector("#input").value;
  let inputType = validateInput(input);
  let link = ""; 
  if (inputType == "zip") {
    link = await createLinkFromZip(input, type);
  }
  if (inputType == "city") {
    link = await createLinkFromCity(input, type);
  }
  if (inputType == "undefined") {
    document.querySelector("#container").innerHTML = "Please enter a valid Zip or  comma separated City and State";
    document.querySelector("#container").style.color = "red";
  } else {
    previousURL = link;
    if(previousURL != "") {
      console.log(link);
      let response = await fetch(link);
      let data = await response.json();
      console.log(data);
      if(type == "current") {
        fillContainerItem(data);
      } else {
        fillContainerArray(data);
      }
    } else {
      document.querySelector("#container").innerHTML = "City or Zip could not be found";
      document.querySelector("#container").style.color = "red";
    }
    
  }
}

//helper function to fill the container with the current weather information
function fillContainerItem(data) {
  let container = "";
  img = setImage(data);
  container += "<div class=\"entry\">"
    + "<div class=\"text\"><div class=\"entryHeader\">"
    + "Current Conditions" + "<br></div>"
    + "<div class=\"entryText\">"
    + "<span class=\"label\" id=\"temp\">" + "Temp: " + "</span>" 
    + "<span class=\"datatext\" id=\"temp\">" + data.main.temp + "</span><br>"
    + "<span class=\"label\" id=\"feelslike\">" + "Feels like: " + "</span>"
    + "<span class=\"datatext\" id=\"feelslike\">" + data.main.feels_like + "</span><br>"
    + "<span class=\"label\" id=\"humidity\">" + "Humidity: " + "</span>"
    + "<span class=\"datatext\" id=\"humidity\">" + data.main.humidity + "</span><br>"
    + "<span class=\"label\" id=\"windspeed\">" + "Wind speed: " + "</span>"
    + "<span class=\"datatext\" id=\"windspeed\">" + data.wind.speed + "</span><br>"
    + "</div></div><div class=\"image\">" + img + "</div></div>";
  document.querySelector("#container").innerHTML = container;
}

//helper function to fill the container with the forecast information
function fillContainerArray(data) { 
  let container = "";
  for (let i = 0; i < data.list.length; i++) {
    let date = new Date(data.list[i].dt_txt);
    date.setHours(date.getHours() - 8);
    img = setImage(data.list[i]);
    console.log(data.list[i]);
    container += "<div class=\"entry\">"
      + "<div class=\"text\"><div class=\"entryHeader\">"
      + date.toLocaleString() + "<br></div>"
      + "<div class=\"entryText\">"
      + "<span class=\"label\" id=\"temp\">" + "Temp: " + "</span>" 
      + "<span class=\"datatext\" id=\"temp\">" + data.list[i].main.temp + "</span><br>"
      + "<span class=\"label\" id=\"feelslike\">" + "Feels like: " + "</span>"
      + "<span class=\"datatext\" id=\"feelslike\">" + data.list[i].main.feels_like + "</span><br>"
      + "<span class=\"label\" id=\"humidity\">" + "Humidity: " + "</span>"
      + "<span class=\"datatext\" id=\"humidity\">" + data.list[i].main.humidity + "</span><br>"
      + "<span class=\"label\" id=\"windspeed\">" + "Wind speed: " + "</span>"
      + "<span class=\"datatext\" id=\"windspeed\">" + data.list[i].wind.speed + "</span><br>"
      + "</div></div><div class=\"image\">" + img + "</div></div>";
  }
  document.querySelector("#container").innerHTML = container;
}

//helper function to set the image based on the weather condition
function setImage(data) {
  let icon = data.weather[0].icon;
  switch(icon) {
    case "01d":
      return "<img src=\"img/sun-symbol-emoji.png\">";
    case "01n":
      return "<img src=\"img/moon-512.webp\">";
    case "02d":
      return "<img src=\"img/partly-cloudy-icon.png\">";
    case "02n":
      return "<img src=\"img/39857.png\">";
    case "03d":
      return "<img src=\"img/scattered_clouds.webp\">";
    case "03n":
      return "<img src=\"img/scattered_clouds.webp\">";
    case "04d":
      return "<img src=\"img/9522206.png\">";
    case "04n":
      return "<img src=\"img/39857.png\">";
    case "09d":
      return "<img src=\"img/6408892.png\">";
    case "09n":
      return "<img src=\"img/6408892.png\">";
    case "10d":
      return "<img src=\"img/rain-light.png\">";
    case "10n":
      return "<img src=\"img/rain-light.png\">";
    case "11d":
      return "<img src=\"img/thunderstorm.png\">";
    case "11n":
      return "<img src=\"img/thunderstorm.png\">";
    default:
      return data.weather[0].main;
  }
}