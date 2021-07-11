// Get references to page elements
$(document).ready(function () {
  const $bogoList = $("#bogo-list");
  $.get("api/bogos", function (list) {
    for (let i = 0; i < list.length; i++) {
      let bogo = list[i].item;
      $("#bogo-list").append(
        "<p class='h6 bogo'>" + bogo + "</p><hr class='bogo'>"
      );
    }
  });
});

//get the weather and put it on the page
var APIKey = "94531e392a37140471434fb0ff8281ea";

// Here we are building the URL we need to query the database
var queryURL =
  "https://api.openweathermap.org/data/2.5/weather?" +
  "zip=34232&units=imperial&appid=" +
  APIKey;

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
  url: queryURL,
  method: "GET"
})
  // We store all of the retrieved data inside of an object called "response"
  .then(function (response) {
    const temp = "Temp: " + response.main.temp + " F";
    const humidity = "Humidity: " + response.main.humidity + "%";
    const wind = "Wind Speed: " + parseInt(response.wind.speed) + " mph";
    let sunsetTimestamp = parseInt(response.sys.sunset) * 1000;
    const d = new Date(sunsetTimestamp);
    let sunset = d.getHours() - 12;
    if (parseInt(d.getMinutes()) < 10) {
      sunset += ":0" + d.getMinutes() + " PM";
    } else {
      sunset += ":" + d.getMinutes() + " PM";
    }

    // Transfer content to HTML
    const $weather = $("#weatherContainer");
    $weather.append("<p class='h6'>" + temp + "</p>");
    $weather.append("<p class='h6'>" + humidity + "</p>");
    $weather.append("<p class='h6'>" + wind + "</p>");
    $weather.append("<p class='h6'>Sunset: " + sunset + "</p>");
  });

$.getJSON(
  "https://api.countapi.xyz/hit/flccesrq.com/visits",
  function (response) {
    $("#visits").text(
      "This page has been visited " + response.value + " times since July 2021"
    );
  }
);

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
