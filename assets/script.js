/* Declaring a constant variable named searchBtn and assigning it the value of the element with the id
of search-submit. */
const searchBtn = document.getElementById("search-submit");

/* Declaring a constant variable named input and assigning it the value of the element with the id of
location. */
const input = document.getElementById("location");

/* Declaring a variable named prevSearch and assigning it an empty array. */
let prevSearch = [];

/* Declaring a constant variable named select and assigning it the value of the element with the id of
cities. */
const select = document.getElementById("cities");

/* Declaring a constant variable named apiKey and assigning it the value of the API key. */
const apiKey = "67febe86d8dd4147336015e28a109e2e";


/**
 * The function takes in a location as a parameter, and then uses the fetch API to get the weather data
 * from the OpenWeatherMap API.
 * @param location - The city name that the user entered
 */
function position(location) {
   let currCity = document.getElementById("currLocation");
   currCity.textContent = capitalize(location);
 
   let apiUrl =
     "http://api.openweathermap.org/geo/1.0/direct?q=" +
     location +
     "&appid=" +
     apiKey;
 
   fetch(apiUrl)
     .then(function (response) {
       if (response.ok) {
         response.json()
         .then(function (data) {
           getWeather(data);
         });
       } else {
         alert("Location Not Found");
       }
     })
 
     .catch(function (error) {
       alert("Unable to use API at the moment");
     });
 }


/**
 * The userSearched function is called when the user clicks the search button. It prevents the default
 * action of the button, then it takes the value of the input field and trims it, then it makes it
 * lowercase, then it calls the position function and passes the searchedCity variable to it, then it
 * checks to see if the searchedCity variable is empty or null, if it is, it alerts the user to enter a
 * city, if it isn't, it checks to see if the searchedCity variable is in the prevSearch array, if it
 * isn't, it pushes it to the array, then it resets the select element's innerHTML to the default
 * option, then it calls the chooseCity function, then it calls the saveSearch function.
 * @param event - The event object is a JavaScript object that contains useful information about an
 * event when it occurs, such as what kind of event it is, what element it occurred on, and where the
 * user's mouse was located when the event occurred.
 */
function userSearched(event) {
  event.preventDefault();

  let searchedCity = input.value.trim();
  searchedCity = searchedCity.toLowerCase();

  position(searchedCity);

  if (searchedCity === null || searchedCity === "") {
    alert("Please Enter A City");
  } else if (!prevSearch.includes(searchedCity)) {
    prevSearch.push(searchedCity);

    select.innerHTML = '<option value="Choose a city">Previously Searched</option>';

    chooseCity();
  }

  saveSearch();

};
searchBtn.addEventListener("click", userSearched);


/**
 * When the user changes the value of the select element, the formHandler function is called, which
 * gets the value of the selected option, and then calls the position function, passing the selected
 * value as an argument.
 */
function formHandler() {
   let selectedCity = select.options[select.selectedIndex].value;
 
   position(selectedCity);
 
   select.selectedIndex = 0;
 }
 select.addEventListener("change", formHandler);



/**
 * The function gets the latitude and longitude of the location from the locationData array, then uses
 * the latitude and longitude to get the weather data from the API.
 * @param locationData - [{lat: "", lon: ""}]
 */
function getWeather(locationData) {
   
  let locationLat = locationData[0].lat;
  let locationLon = locationData[0].lon;
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    locationLat +
    "&lon=" +
    locationLon +
    "&units=imperial&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (data) {
          Weather(data.current);

          forecast(data.daily);
        });
      } else {
        alert("location data not found");
      }
    })
    .catch(function (error) {
      alert("Unable to use API at the moment");
    });
}


/**
 * The function takes in a locationWeather object and displays the current weather information for that
 * location.
 * @param locationWeather - {
 */
function Weather(locationWeather) {
  let temp = document.getElementById("temp");
  temp.textContent = Math.round(locationWeather.temp) + "°F";

  let uvIndex = document.getElementById("uv-index");
  uvIndex.classList = "";
  uvIndex.classList = "px-3 rounded";
  uvIndex.textContent = locationWeather.uvi;

  if (0 <= locationWeather.uvi < 3) {
    uvIndex.classList.add("uv-low");
  } else if (3 <= locationWeather.uvi < 8) {
    uvIndex.classList.add("uv-moderate");
  } else if (8 <= locationWeather.uvi) {
    uvIndex.classList.add("uv-high");
  }

  let wind = document.getElementById("wind");
  wind.textContent = locationWeather.wind_speed + " mph";

  let humidity = document.getElementById("humidity");
  humidity.textContent = locationWeather.humidity + "%";
};


/**
 * The function dateNow() is called and the current date is displayed in the element with the id of
 * currDate.
 */
 function dateNow() {

   let currDay = document.getElementById('currDate');
   let newDate = moment().format('dddd, MMMM Do, YYYY');
   currDay.textContent = newDate;

}
dateNow();

/**
 * The function takes the locationForecast array as an argument and loops through the array to create a
 * new div element for each day of the forecast. 
 * 
 * The function then creates a new h3 element for each day of the forecast and appends the date,
 * weekday, icon, min temp, max temp, wind speed, and humidity to the div element. 
 * 
 * The function then appends the div element to the weekDayContainer div.
 * @param locationForecast - the array of objects that contains the weather data for the next 5 days
 */
function forecast(locationForecast) {
  const days = document.getElementById("weekDayContainer");

  days.innerHTML = "";

  for (i = 1; i < 6; i++) {
    let day = document.createElement("div");
    day.classList = "days";

    let date = document.createElement("h3");

    let dtDate = locationForecast[i].dt;

    let dayDate = moment.unix(dtDate).format("MMMM DD, Y");
    date.textContent = dayDate;

    let weekDay = document.createElement("h3");

    let weekDayDate = moment.unix(dtDate).format("dddd");
    weekDay.textContent = weekDayDate;

    let iconContainer = document.createElement("div");
    iconContainer.classList = "imageContainer";
    
    let dayIcon = document.createElement("img");
    dayIcon.classList = "icon";
    dayIcon.setAttribute(
      "src",
      "http://openweathermap.org/img/wn/" +
        locationForecast[i].weather[0].icon +
        "@2x.png"
    );

    iconContainer.append(dayIcon);

    let dateMinTemp = document.createElement("h3");
    dateMinTemp.textContent =
      "L: " + Math.round(locationForecast[i].temp.min) + " °F";

    let dateMaxTemp = document.createElement("h3");
    dateMaxTemp.textContent =
      "H: " + Math.round(locationForecast[i].temp.max) + " °F";

    let dateWind = document.createElement("h3");
    dateWind.textContent = locationForecast[i].wind_speed + " mph";

    let dateHumidity = document.createElement("h3");
    dateHumidity.classList = "day-humidity";
    dateHumidity.textContent =
      "Humidity: " + locationForecast[i].humidity + "%";

    day.append(
      date,
      weekDay,
      iconContainer,
      dateMinTemp,
      dateMaxTemp,
      dateWind,
      dateHumidity
    );
    days.append(day);
  }
};

/**
 * The function saves the search history to local storage.
 */
function saveSearch() {
   localStorage.setItem("Cities", JSON.stringify(prevSearch).toLowerCase());
 };

/**
 * If there are no saved cities, do nothing. If there are saved cities, set the previous search to the
 * saved cities.
 * @returns the value of the variable savedCities.
 */
function loadCities() {
  let savedCities = localStorage.getItem("Cities");

  savedCities = JSON.parse(savedCities);

  if (savedCities === null) {
    return;
  } else {
    prevSearch = savedCities;
  }
}
loadCities();

/**
 * It loops through the array of previous searches, creates an option element for each item in the
 * array, sets the value of the option to the lowercase version of the item, and sets the text content
 * of the option to the capitalized version of the item.
 * 
 * The function then appends each option to the select element.
 */
function chooseCity() {
   for (i = 0; i < prevSearch.length; i++) {
     let option = document.createElement("option");
     option.value = prevSearch[i].toLowerCase();
     option.textContent = capitalize(prevSearch[i]);
 
     select.append(option);
   }
 }
 chooseCity();


/**
 * If the location has a space, split the string into an array of words, capitalize the first letter of
 * each word, and join the array back into a string. Otherwise, capitalize the first letter of the
 * string
 * @param location - The location to capitalize.
 * @returns The capitalized city name.
 */
function capitalize(location) {
   let space = location.includes(" ");
 
   let capitalCity;
 
   if (space) {
     let words = location.split(" ");
 
     for (let i = 0; i < words.length; i++) {
       words[i] = words[i][0].toUpperCase() + words[i].substr(1);
     }
     capitalCity = words.join(" ");
   } else {
     capitalCity = location[0].toUpperCase() + location.substring(1);
   }
 
   return capitalCity;
 };