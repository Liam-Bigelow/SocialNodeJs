
/**
 * -- Task ---
 * 
 * - user registration using unique username and password
 * - user login
 */


const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // need to hash passwords

const { DatabaseError, InputError, UnsupportedError } = require( "../helpers/errors" );

// bring in user model
require( "../models/user.model" );
const User = mongoose.model( "User" );


// ### Controller functions ###

const register = (username, password) => {
    return new Promise(async (resolve, reject) => {
        /**
         * Potential edge cases
         * - username not provided
         * - password not provided
         * - username already used
         */

        if( !username ){
            reject( new InputError( "Username not provided." ) );
            return;
        };
        if( !password ){
            reject( new InputError( "Passowrd not provided." ) );
            return;
        }

        try {
            const usernameIsUsed = await User.exists({username: username});
            if( !usernameIsUsed ){
                reject( new UnsupportedError( "Username already used." ) );
                return;
            }

            // if we made it this far the user can be registered
            password = bcrypt.hash( password, parseInt( process.env.SALT ) ); // need to hash passwords before storing
            const userObject = { username, password };
            const newUser = new User( userObject );
            await newUser.save();

            resolve( userObject );
        } catch( error ) {
            // if here then something with the database query failed
            reject( new DatabaseError( error.message ) );
        }
    });
}



module.exports = {
    register
}



