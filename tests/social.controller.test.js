

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

test( "getTweet - success", async () => {
    var newTweet;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        newTweet = await controller.createTweet( authorId, authorUsername, "This is an example of a new tweet" );
        expect( await Tweet.findById( newTweet._id ) ).toBeTruthy();

        // now retrieve tweet
        const retrievedTweet = await controller.getTweet( newTweet._id );
        expect( retrievedTweet.authorUsername == newTweet.authorUsername && retrievedTweet.message === newTweet.message  ).toBeTruthy();
    } catch ( error ) {
        expect( false ).toBe( true ); // force fail
    } finally {
        if( newTweet ) {
            await Tweet.findByIdAndDelete( newTweet._id );
        }
    }
});

test( "getTweet - fail - no tweet id", async () => {
    try {
        await controller.getTweet( undefined );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    }
});

test( "getTweet - fail - non existant id", async () => {
    try {
        await controller.getTweet( new mongoose.Types.ObjectId() );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    }
});


// ------- updateTweet -------

test( "updateTweet - success", async () => {
    var newTweet;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        newTweet = await controller.createTweet( authorId, authorUsername, "This is an example of a new tweet" );
        expect( await Tweet.findById( newTweet._id ) ).toBeTruthy();

        // update tweet
        const updatedMessage = "This is an updated tweet message";
        await controller.updateTweet( authorId, newTweet._id, updatedMessage );

        const updatedTweet = await Tweet.findById( newTweet._id );
        expect( updatedTweet.message === updatedMessage ).toBeTruthy();
    } catch ( error ) {
        expect( false ).toBe( true ); // force fail
    } finally {
        if( newTweet ) {
            await Tweet.findByIdAndDelete( newTweet._id );
        }
    }
});

test( "updateTweet - fail - unauthorized author", async () => {
    var newTweet;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        newTweet = await controller.createTweet( authorId, authorUsername, "This is an example of a new tweet" );
        expect( await Tweet.findById( newTweet._id ) ).toBeTruthy();

        // update tweet
        const updatedMessage = "This is an updated tweet message";
        await controller.updateTweet( new mongoose.Types.ObjectId(), newTweet._id, updatedMessage );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    } finally {
        if( newTweet ) {
            await Tweet.findByIdAndDelete( newTweet._id );
        }
    }
});

test( "updateTweet - fail - no author", async () => {
    try {
        const tweetId = uuid.v4();
        await controller.updateTweet( undefined, tweetId, "This is an example of a new tweet" );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    } 
});

test( "updateTweet - fail - no tweet id", async () => {
    try {
        const authorId = new mongoose.Types.ObjectId();
        await controller.updateTweet( authorId, undefined, "This is an example of a new tweet" );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    } 
});

test( "updateTweet - fail - no message", async () => {
    try {
        const authorId = new mongoose.Types.ObjectId();
        const tweetId = uuid.v4();
        await controller.updateTweet( authorId, tweetId, "" );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    } 
});


// ------- deleteTweet -------

test( "deleteTweet - success", async () => {
    var newTweet;
    var isFailed = false;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        newTweet = await controller.createTweet( authorId, authorUsername, "This is an example of a new tweet" );
        expect( await Tweet.findById( newTweet._id ) ).toBeTruthy();

        // delete tweet
        await controller.deleteTweet( authorId, newTweet._id );
        expect( await Tweet.findById( newTweet._id ) ).toBeFalsy();
    } catch ( error ) {
        isFailed = true;
        expect( false ).toBe( true ); // force fail
    } finally {
        if( isFailed ) {
            await Tweet.findByIdAndDelete( newTweet._id );
        }
    }
});

test( "deleteTweet - fail - unauthorized author", async () => {
    var newTweet;
    var isFailed = false;
    try {
        const authorId = new mongoose.Types.ObjectId(); // NOTE: in practice this is retrieved from session after authenticated
        const authorUsername = uuid.v4();
        newTweet = await controller.createTweet( authorId, authorUsername, "This is an example of a new tweet" );
        expect( await Tweet.findById( newTweet._id ) ).toBeTruthy();

        // delete tweet
        await controller.deleteTweet( new mongoose.Types.ObjectId(), newTweet._id );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        isFailed = true;
        expect( error instanceof UnsupportedError ).toBeTruthy();
    } finally {
        if( isFailed ) {
            await Tweet.findByIdAndDelete( newTweet._id );
        }
    }
});

test( "deleteTweet - fail - no author", async () => {
    try {
        const tweetId = uuid.v4();
        await controller.deleteTweet( undefined, tweetId );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof UnsupportedError ).toBeTruthy();
    } 
});

test( "deleteTweet - fail - no tweet id", async () => {
    try {
        const authorId = new mongoose.Types.ObjectId();
        await controller.deleteTweet( authorId, undefined );
        expect( false ).toBe( true ); // should not get here
    } catch ( error ) {
        expect( error instanceof InputError ).toBeTruthy();
    } 
});


// ------- teardown -------

afterAll( done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})