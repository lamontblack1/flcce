// Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAItQs2KtkI5j3pM3FN8yxN_ZnFLyifruI",
  authDomain: "service-storage-acc7a.firebaseapp.com",
  databaseURL: "https://service-storage-acc7a-default-rtdb.firebaseio.com",
  projectId: "service-storage-acc7a",
  storageBucket: "service-storage-acc7a.appspot.com",
  messagingSenderId: "10223659033",
  appId: "1:10223659033:web:6b998588ce24ad03796288"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a reference the database
let db = firebase.database();

// Create a root reference, but dont' need unless you use pictures
var storageRef = firebase.storage().ref();

//************************************************************
const postsListRef = db.ref("/flcce/posts");
const boardListRef = db.ref("/flcce/board");
let browserIsSafari = false;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// Get references to page elements
$(document).ready(function () {
  if (navigator.sayswho.includes("Safari")) {
    browserIsSafari = true;
  }

  // postsListRef.push({
  //   msgHeader: "New Posts Feature Under Construction",
  //   msgText:
  //     "We are currently working on a new feature for administrators to be able to add posts in the future. Please stay tuned!",
  //   messageTime: firebase.database.ServerValue.TIMESTAMP
  // });

  boardListRef.on(
    "child_added",
    function (snapshot) {
      $("#director" + snapshot.val().order).prepend(
        "<p class='text-center board-p'>" +
          snapshot.val().name +
          "</p><p class='text-center'>" +
          snapshot.val().title +
          "</p>"
      );
    },
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

  postsListRef.limitToLast(20).on(
    "child_added",
    function (snapshot) {
      // msgIdCounter = msgIdCounter + 1;
      // let dateVal = snapshot.val().messageTime;
      let msgDate = new Date(snapshot.val().messageTime)
      // msgDate = msgDate.parse(snapshot.val().messageTime)
      let msgDay = msgDate.getDate();
      msgDay = parseInt(msgDay)
      const msgMonth = msgDate.getMonth()+1
      const msgYear = msgDate.getFullYear()
      const msgTimeStamp = msgMonth + "/" + msgDay + "/" + msgYear;

      // let msgTimeStamp = moment(dateVal).fromNow(false)
      // let msgTimeStamp = moment(dateVal).format("MMMM D");
      // console.log(msgTimeStamp);
      let msgHeader = snapshot.val().msgHeader;
      // msgPlayerName = msgPlayerName.toLowerCase().trim();
      let msgText = snapshot.val().msgText;
      //this can help add a picture
      // let imgLine =
      //   "<img src='./images/" +
      //   msgPlayerName +
      //   ".jpg' class='userPic' alt='...'></img>";

      // if file or picture

      //handle first messages when page loads
      // if (msgPlayerName === $("#nameInput").val().toLowerCase()) {
      //   $("#messagesBox").prepend(
      //     "<div class='row mb-1'><div class='col-2'></div><div class='col-10'>" +
      //       "<div class='card' id='" +
      //       snapshot.key +
      //       "' style='background-color: #DABFFF;'><div class='card-header p-1 pl-2'>" +
      //       imgLine +
      //       msgPlayerName +
      //       "  <small class='text-muted'>" +
      //       msgTimeStamp +
      //       "</small><button class='btnDelete btn btn-outline-secondary font-weight-bold mb-1' type='button' data='" +
      //       snapshot.key +
      //       "'>x</button></div>" +
      //       "<div class='card-body py-1 pl-2'><p class='card-title'>" +
      //       msgMessage +
      //       "</p>" +
      //       "</div></div>" +
      //       "</div>" +
      //       "</div>"
      //   );
      // } else if ($("#nameInput").val() == "") {
      //   $("#messagesBox").prepend(
      //     "<div class='row mb-1'><div class='col-1'></div><div class='col-10'>" +
      //       "<div class='card' id='" +
      //       snapshot.key +
      //       "' style='background-color: #C49BBB;'><div class='card-header p-1 pl-2'>" +
      //       imgLine +
      //       msgPlayerName +
      //       "  <small class='text-muted'>" +
      //       msgTimeStamp +
      //       "</small><button class='btnDelete btn btn-outline-secondary font-weight-bold mb-1' type='button' data='" +
      //       snapshot.key +
      //       "'>x</button></div>" +
      //       "<div class='card-body py-1 pl-2'><p class='card-title'>" +
      //       msgMessage +
      //       "</p>" +
      //       "</div></div>" +
      //       "</div>" +
      //       "</div>"
      //   );

      //Put messages from others on the left
      $("#postsContainer").prepend(
        "<div class='card mb-2 bg-transparent' id='" +
          snapshot.key +
          "'>" +
          "<div class='card-header p-1 pl-2'>" +
          "<span class='text-muted' style='float: right'>Posted " +
          msgTimeStamp +
          "</span>" +
          // "<button class='btnDelete btn btn-outline-secondary font-weight-bold mb-1' type='button' style='float: right;' data='" +
          //   snapshot.key +
          //   "'>x</button>" +
          "<h3>" +
          msgHeader +
          "</h3>" +
          "</div>" +
          "<div class='card-body py-1 pl-2 bg-transparent'><p class='card-title'>" +
          msgText +
          "</p>" +
          "</div></div>"
      );

      // Handle the errors
    },
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

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

  // get the events from event scraper api
  // $.get("api/events", function (events) {
    
  //   $("#eventsList").append("Test");
  //   const crappyEvents = ["pride", "drag "];

  //   let datePlacemark = "";
  //   let strHtml = "";
  //   for (let i = 0; i < events.length; i++) {
  //     const event = events[i];

  //     const eventLower = event.event.toLowerCase().substring(0, 5);
  //     if (!crappyEvents.includes(eventLower)) {
  //       const eventDate = new Date(event.eventDate);
  //       const dateMonth = parseInt(eventDate.getMonth());
  //       let dateDay = eventDate.getDate();
  //       // if (browserIsSafari) {
  //       //   dateDay += 1;
  //       // }
  //       const eventMonthDay = months[dateMonth] + " " + dateDay;
  //       const eventLink =
  //         "<p class='h6'><a href='" +
  //         event.url +
  //         "' target='_blank'>" +
  //         event.event +
  //         "</a></p>";

  //       if (eventMonthDay !== datePlacemark) {
  //         strHtml =
  //           "<hr class='bogo'><h5 class='card-subtitle mt-2 mb-2 text-muted text-center'><b>" +
  //           eventMonthDay +
  //           "</b></h5>" +
  //           eventLink;
  //       } else {
  //         strHtml = eventLink;
  //       }
  //       datePlacemark = eventMonthDay;
  //       $("#eventsList").append(strHtml);
  //     }
  //   }
  // });
});

//get the weather and put it on the page
var APIKey = "94531e392a37140471434fb0ff8281ea";

// Here we are building the URL for the weather
var queryURL =
  "https://api.openweathermap.org/data/2.5/weather?" +
  "zip=34232&units=imperial&appid=" +
  APIKey;

// Here we run our AJAX call to openweathermap
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
          "<hr><p class='text-center h6'>Rain Chance | Lo-Hi Temp</p>"
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

navigator.sayswho = (function () {
  var ua = navigator.userAgent;
  var tem;
  var M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return "IE " + (tem[1] || "");
  }
  if (M[1] === "Chrome") {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(" ");
})();

// Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
