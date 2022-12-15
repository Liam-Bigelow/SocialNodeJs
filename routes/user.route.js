
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const passport = require("passport");
const LocalStrategy = require('passport-local');
const mongoose = require("mongoose");

// bring in user model
require( "../models/user.model" );
const User = mongoose.model( "User" );


/** 
 * First define how we are going to handle authentication
 * 
 * going to use a local-strategy to deal with user authentication
 * 
 * - https://www.passportjs.org/packages/passport-local/
 * - https://github.com/jaredhanson/passport-local
 */


// configure authentication strategy
passport.use(new LocalStrategy(function verify(username, password, done) {
    User.findOne({username: username }).lean()
    .then( (user) => {
        if( !user ){
            return done(null, false, { message: 'User does not exists.' });        
        }

        // we have a user but need to make sure it is valid
        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error){
                return done( error );
            }

            return isMatch ? done( null, user ) : done(null, false, { message: "Password incorrect." });
        });
    })
    .catch( (error) => {
        return done( error );
    });
}));

// configure session management
passport.serializeUser(function(user, done) {
    process.nextTick(function() {
        done(null, { id: user._id, username: user.username });
    });
});
  
passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
        return done(null, user);
    });
});





/**
 * -- Task ---
 * 
 * - user registration using unique username and password
 * - user login
 */


const {ensureAuth} = require("./middleware/authentication.middleware" );

const controller = require( "../controllers/user.controller");


router.get( "/dashboard", ensureAuth, (req, res) => {
    res.status(200).send( "User logged in..." );
});

// login
router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/user/dashboard',
    failureRedirect: '/',
    failureMessage: true
}));

// register
router.post( "/register", (req, res) => {
    // should take username and password as body parameters
    controller.register( req.body.username, req.body.password )
    .then( (newUser) => {
        res.status( 200 ).json( newUser );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).send( error );
    })
});



module.exports = router;