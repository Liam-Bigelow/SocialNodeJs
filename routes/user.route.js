
/**
 * -- Task ---
 * 
 * - user registration using unique username and password
 * - user login
 */


const express = require("express");
const router = express.Router();

const {ensureAuth} = require("./middleware/authentication.middleware" );

const controller = require( "../controllers/user.controller");


router.get( "/dashboard", ensureAuth, (req, res) => {
    res.status(200).send( "User logged in..." );
});

// login
router.post( "/login", (req, res) => {
    // should take username and password as body parameters
});

// register
router.post( "/register", (req, res) => {
    // should take username and password as body parameters
    controller.register( req.body.username, req.body.password )
    .then( (newUser) => {
        res.status( 200 ).json( newUser );
    })
    .catch( (error) => {
        res.status( 500 ).json( error );
    })
});

