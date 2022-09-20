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

// Create a root reference
var storageRef = firebase.storage().ref();

//************************************************************
const postsListRef = db.ref("/flcce/posts");

// Get references to page elements
$(document).ready(function () {
  postsListRef.limitToLast(40).on(
    "child_added",
    function (snapshot) {
      //   console.log(snapshot.val());
      // msgIdCounter = msgIdCounter + 1;
      let dateVal = snapshot.val().messageTime;
      // let msgTimeStamp = moment(dateVal).fromNow(false)
      let msgTimeStamp = moment(dateVal).format("dddd MMM D  h:mma");
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
          "<div class='card-header p-1 pl-2' style='background-color: #fcded8;'>" +
          "<span class='text-muted'>" +
          msgTimeStamp +
          "</span>" +
          "<button class='btnDelete btn btn-outline-secondary font-weight-bold mb-1' id='#btnDelete' type='button' style='float: right;' data='" +
          snapshot.key +
          "'>x</button>" +
          "<h3>" +
          msgHeader +
          "</h3>" +
          "</div>" +
          "<div class='card-body py-1 pl-2 bg-transparent'><p class='card-title' id='post" +
          snapshot.key +
          "'>" +
          msgText +
          "</p>" +
          "</div></div>"
      );

      //   document.getElementById("#post" + snapshot.key).innerHTML = msgText;

      // Handle the errors
    },
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

  $("#btnSubmit").on("click", function (event) {
    event.preventDefault();
    if ($("#inputHeading").val() !== "" && $("#inputPost").val() !== "") {
      let post = $("#inputPost").val();
      post = urlify(post);
      const separateLines = post.split(/\r?\n|\r|\n/g);
      let formattedPost = "";
      let URL = "";
      for (let i = 0; i < separateLines.length; i++) {
        const element = separateLines[i];
        if (i !== separateLines.length - 1) {
          formattedPost += element + "<br>";
        } else {
          formattedPost += element;
        }
      }
      const heading = $("#inputHeading").val();
      //If there is a file to upload
      if ($("#fileInput").val() !== "") {
        //upload and then push message in returned promise
        const selectedFile = document.getElementById("fileInput").files[0];

        // Create a reference to 'mountains.jpg'
        // var picRef = storageRef.child(selectedFile.name);

        // Create a reference to 'images/mountains.jpg'
        const fileImageRef = storageRef.child("flcce/" + selectedFile.name);

        fileImageRef.put(selectedFile).then((snapshot) => {
          console.log("uploaded!");
          fileImageRef
            // .child("images/" + selectedFile.name)
            .getDownloadURL()
            .then((url) => {
              // `url` is the download URL for 'images/stars.jpg'

              // This can be downloaded directly:
              // var xhr = new XMLHttpRequest();
              // xhr.responseType = "blob";
              // xhr.onload = (event) => {
              //   var blob = xhr.response;
              // };
              // xhr.open("GET", url);
              // xhr.send();

              // Or inserted into an <img> element
              //clear the file input
              //send message with the URL for the picture or file
              const linkElement =
                "<a href=" +
                url +
                " target='_blank'>" +
                selectedFile.name +
                "</a>";
              formattedPost += "<br>" + linkElement;
              postsListRef.push({
                msgHeader: heading,
                msgText: formattedPost,
                messageTime: firebase.database.ServerValue.TIMESTAMP
              });

              $("#inputHeading").val("");
              $("#inputPost").val("");
              $("#fileInput").val("");
            });
        });
      } else {
        postsListRef.push({
          msgHeader: heading,
          msgText: formattedPost,
          messageTime: firebase.database.ServerValue.TIMESTAMP
        });

        $("#inputHeading").val("");
        $("#inputPost").val("");
        $("#fileInput").val("");
      }
    } else {
      alert("Heading or Message is empty!");
    }
  });

  $("body").on("click", "button.btnDelete", function () {
    if (
      confirm(
        "ARE YOU SURE you want to delete this post? Once you delete it you cannot undo it."
      )
    ) {
      const msgKey = $(this).attr("data");
      db.ref("/flcce/posts/" + msgKey).remove();
      $("#" + msgKey).remove();
    }
  });
});

function urlify(text) {
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '" target="_blank">' + url.substring(8) + "</a>";
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
