const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

//registration handler
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    //If you decide to use field names other than username and password
    // {
    //   usernameField: "email",
    //   passwordField: "passwd",
    // },
    function (req, username, password, done) {
      db.User.findOne({ where: { username: username } }).then(function (
        err,
        user
      ) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {
            message: "Username is already in use. Choose a different one"
          });
        }
        db.User.create({
          nickname: req.body.nickname,
          username: username,
          password: password,
          userType: req.body.userType
        }).then(function (dbUser) {
          return done(null, dbUser);
        });
      });
    }
  )
);

//login handler
passport.use(
  "local-signin",
  new LocalStrategy(function (username, password, done) {
    db.User.findOne({ where: { username: username } }).then(function (user) {
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: "Incorrect password. Try again." });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

module.exports = passport;
