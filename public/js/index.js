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
  // get Marcos deal and populate the dropdown
  $.get("api/marcos", function (list) {
    for (let i = 0; i < list.length; i++) {
      $("#marcosDeals").append(
        "<a class='dropdown-item small text-wrap' href='#'>" +
          list[i].item +
          "</a>"
      );
    }
  });

  // $.get("api/events", function (events) {

  //   console.log(events);
  // });
});

//get the weather and put it on the page
var APIKey = "94531e392a37140471434fb0ff8281ea";

// Here we are building the URL for the weather
var queryURL =
  "https://api.openweathermap.org/data/2.5/weather?" +
  "zip=34232&units=imperial&appid=" +
  APIKey;

// Here we run our AJAX call to
$.ajax({
  url: queryURL,
  method: "GET"
})
  // We store all of the retrieved data inside of an object called "response"
  .then(function (response) {
    // console.log(response);
    const temp = "Temp: " + Math.round(response.main.temp) + "\xB0 F";
    const humidity = "Humidity: " + response.main.humidity + "%";
    const pressure = "Pressure: " + response.main.pressure;
    //convert degrees to direction
    const val = parseInt(parseInt(response.wind.deg) / 22.5 + 0.5);
    const arr = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW"
    ];
    const dir = arr[val % 16];
    const wind = "Wind: " + parseInt(response.wind.speed) + " mph " + dir;
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
    $weather.append(
      "<p class='h6'>" +
        pressure +
        " mbar (" +
        parseInt(0.75006 * parseInt(response.main.pressure)) +
        " mmHg)</p>"
    );
    $weather.append("<p class='h6'>" + wind + "</p>");
    $weather.append("<p class='h6'>Sunset: " + sunset + "</p>");

    var DateTime = luxon.DateTime;
    $.get(
      "https://api.openweathermap.org/data/2.5/onecall?lat=27.31&lon=-82.49&exclude=minutely,hourly&units=imperial&appid=67058c0a4916682129e32ab03c8f22d4",
      function (data) {
        // console.log(data);
        $weather.append(
          "<p class='h6'>UV Index This Hour: " + data.current.uvi + "</p>"
        );
        $weather.append(
          "<hr><p class='text-center h6'>Rain Chance | Hi-Lo Temp</p>"
        );
        for (let i = 0; i < 5; i++) {
          const dt = DateTime.fromSeconds(data.daily[i].dt);
          let dayName = "";
          if (i === 0) {
            dayName = "Today";
          } else {
            dayName = dt.toFormat("ccc");
          }
          // console.log(dt.toFormat("cccc"));
          // console.log(dt.toLocaleString(DateTime.DATE_SHORT));
          $weather.append(
            "<p class='h6'<span>" +
              dayName +
              ": " +
              parseInt(100 * data.daily[i].pop) +
              "%  |  " +
              parseInt(data.daily[i].temp.min) +
              "\xB0-" +
              parseInt(data.daily[i].temp.max) +
              "\xB0</span><br>"
          );
        }
      }
    );
  });

// This is the counter for how many times the page has been visited
$.getJSON(
  "https://api.countapi.xyz/hit/flccesrq.com/visits",
  function (response) {
    $("#visits").text(
      "This page has been visited " + response.value + " times"
    );
  }
);

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
