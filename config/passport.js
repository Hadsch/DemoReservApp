// Location: /config/passport.js
/*
 var passport    = require('passport'),
 LocalStrategy = require('passport-local').Strategy,
 bcrypt = require('bcrypt-nodejs');

 passport.serializeUser(function(user, done) {
 done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
 User.findById(id, function (err, user) {
 done(err, user);
 });
 });


 passport.use(new LocalStrategy(
 function(username, password, done) {
 User.findOne({ username: username }, function (err, user) {
 if (err) { return done(err); }
 if (!user) {
 return done(null, false, { message: 'Incorrect username.' });
 }
 bcrypt.compare(password, user.password, function(err, res) {
 if (!res) return done(null, false, { message: 'Invalid Password'});
 return done(null, user);
 });
 });
 }
 ));

 // passport.use(new LocalStrategy(
 // function(username, password, done) {
 // User.findByUsername(username).done(function(err, user) {
 // if (err) { return done(null, err); }
 // if (!user || user.length < 1) { return done(null, false, { message: 'Incorrect User'}); }

 // });
 // })
 // );

 module.exports = {
 express: {
 customMiddleware: function(app){
 console.log('express midleware for passport');
 app.use(passport.initialize());
 app.use(passport.session());
 }
 }
 };*/
