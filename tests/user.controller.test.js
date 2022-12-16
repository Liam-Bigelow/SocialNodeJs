

const uuid = require("uuid"); // going to use for just random strings
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// use env variable for mongo uri
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const controller = require("../controllers/user.controller" );

const { InputError, UnsupportedError } = require( "../helpers/errors" );

// include user model for testing
require("../models/user.model");
const User = mongoose.model("User");


// ------- setup -------

beforeAll( done => {
    ( new Promise( async (resolve, reject) => {
        try {
            // connect to db
            mongoose.Promise = global.Promise; // Map global promise - get rid of warning
            await mongoose.connect( process.env.MONGODB_URI );

            resolve( true );
        } catch( error ){
            console.error( error );
            reject( error );
        }
    }))
    .catch( (error) => {
        console.error( error );
    })
    .finally( () => {
        done();
    });
});

test("Initial Test", () => {
    expect( 1 + 1 ).toBe(2);
});

test("MongoDB Connected", () => {
    expect( mongoose.connection.readyState ).toBeTruthy();
});


// ------- register -------

test( "register - success", async () => {
    const username = uuid.v4();
    const password = uuid.v4();

    try {
        const newUser = await controller.register( username, password );
        const isMatch = bcrypt.compareSync( password, newUser.password );

        expect( isMatch ).toBe( true );
    } catch ( error ) {
        expect( false ).toBe( true ); // force fail
    } finally {
        await User.deleteOne({username: username});
    }
});

test( "register - fail - missing username", async () => {
    const password = uuid.v4();

    try {
        await controller.register( undefined, password );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    }
});

test( "register - fail - missing password", async () => {
    const username = uuid.v4();

    try {
        await controller.register( username, undefined );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    }
});

test( "register - fail - account already exists", async () => {
    const username = uuid.v4();
    const password = uuid.v4();

    try {
        const newUser = await controller.register( username, password );
        const isMatch = bcrypt.compareSync( password, newUser.password );
        expect( isMatch ).toBe( true );

        await controller.register( username, password );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    } finally {
        await User.deleteOne({username: username});
    }
});


// ------- teardown -------

afterAll( done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})