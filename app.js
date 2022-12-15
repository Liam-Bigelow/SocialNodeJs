


// ### Load Modules START ###

const express = require("express");
const app = express();

const dotenv = require("dotenv"); // store secret keys in env file
dotenv.config();

const mongoose = require("mongoose"); // used to interact with Database (MongoDB)

const passport = require("passport"); // used to login users

// ### Load Modules END ###


// ### Prepare Middleware START ###

mongoose.connect( process.env.MONGODB_URI )
.then( () => {
    console.log( "MongoDB Connected..." );
})
.catch( (error) => {
    console.error( "MongoDB Connection Failed: \n", error );
});


require("./helpers/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// ### Prepare Middleware END ###


// ### Setup Routes START ###

/**
 * just laying out how I want to define this backend
 * 
 * want to setperate controllers/routing into ones focused on 'tweets' and ones focused on 
 * users (register, login, password reset, ... )
 */

const userRoute = require( "./routes/user.route");
const socialPostRoute = require( "./routes/social.route");

app.use( "/user", userRoute );
app.use( "/social", socialPostRoute );

// ### Setup Routes END ###

const port = 3000;
app.listen(port, () =>
	console.log(`App listening on port ${port}...`)
);




