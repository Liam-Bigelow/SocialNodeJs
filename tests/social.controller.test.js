

const uuid = require("uuid"); // going to use for just random strings
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// use env variable for mongo uri
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const controller = require("../controllers/social.controller" );

const { InputError, UnsupportedError } = require( "../helpers/errors" );

// include user model for testing
require("../models/tweet.model");
const Tweet = mongoose.model("Tweet");


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


// ------- createTweet -------

test( "createTweet - success", async () => {
    var newTweet;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        newTweet = await controller.createTweet( authorId, authorUsername, "This is an example of a new tweet" );
        expect( await Tweet.findById( newTweet._id ) ).toBeTruthy();
    } catch ( error ) {
        expect( false ).toBe( true ); // force fail
    } finally {
        if( newTweet ) {
            await Tweet.findByIdAndDelete( newTweet._id );
        }
    }
});

test( "createTweet - fail - missing author id", async () => {
    try {
        const authorUsername = uuid.v4();
        await controller.createTweet( undefined, authorUsername, "This is an example of a new tweet" );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    }
});


test( "createTweet - fail - missing author username", async () => {
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        await controller.createTweet( authorId, undefined, "This is an example of a new tweet" );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    }
});

test( "createTweet - fail - missing tweet message", async () => {
    var newTweet;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        await controller.createTweet( authorId, authorUsername, "" );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    }
});


// ------- getTweet -------


// ------- teardown -------

afterAll( done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})