
/**
 * -- Task ---
 * 
 * - Create, read, update, delete tweet
*/


const mongoose = require('mongoose');

const { DatabaseError, InputError, UnsupportedError } = require( "../helpers/errors" );

// bring in tweet model
require( "../models/tweet.model" );
const Tweet = mongoose.model( "Tweet" );


// ### Controller functions ###


/**
 * @description create a new user generated tweet
 * 
 * @param {mongoose.Types.ObjectId} authorId 
 * @param {String} authorUsername 
 * @param {String} message 
 * @returns json representation of new tweet
 */
const createTweet = ( authorId, authorUsername, message ) => {
    return new Promise( async (resolve, reject) => {
        if( !authorId || !authorUsername ){
            reject( new UnsupportedError( "Missing author details" ) );
            return;
        }
        if( !message ){
            reject( new InputError( "Missing message" ) );
            return;
        }

        // tweet input must be valid
        try {
            var newTweet = new Tweet({
                authorId,
                authorUsername,
                message
            });
            newTweet = await newTweet.save();
            resolve( newTweet.toObject() ); // wanting to return primary key in object
        } catch ( error ) {
            reject( new DatabaseError( error.message ) );
        }
    });
}


/**
 * @description retrieve a specific tweet
 * 
 * @param {mongoose.Types.ObjectId} tweetId 
 * @returns json representation of the tweet
 */
const getTweet = ( tweetId ) => {
    return new Promise( (resolve, reject) => {
        if( !tweetId ){
            reject( new InputError( "Missing tweet id" ) );
            return;
        }

        Tweet.findById( tweetId ).lean()
        .then( ( tweet ) => {
            if( !tweet ){
                reject( new UnsupportedError( "Unable to find a tweet with the provided id") );
            } else {
                resolve( tweet );  
            }
        })
        .catch( (error) => {
            reject( new DatabaseError( error.message ) );
        })
    });
}


/**
 * @description update specified tweet with new message
 * 
 * @param {mongoose.Types.ObjectId} authorId 
 * @param {mongoose.Types.ObjectId} tweetId 
 * @param {String} newMessage 
 * @returns json representation of the updated tweet
 */
const updateTweet = ( authorId, tweetId, newMessage ) => {
    return new Promise( async (resolve, reject) => {
        if( !tweetId ){
            reject( new InputError( "Missing tweet id" ) );
            return;
        }
        if( !authorId ){
            reject( new UnsupportedError( "Users may only update their own tweets" ) );
            return;
        }
        if( !newMessage ){
            reject( new InputError( "Missing message" ) );
            return;
        }

        try {
            var tweetToUpdate = await Tweet.findOne({ _id: tweetId, authorId: authorId });
            if( !tweetToUpdate ){
                // unable to find a tweet with given values
                reject( new UnsupportedError( "Unable to find a tweet with the provided values") );
                return;
            }

            tweetToUpdate.message = newMessage;
            const updatedTweet = await tweetToUpdate.save();

            resolve( updatedTweet.toObject() );
        } catch( error ) {
            reject( new DatabaseError( error.message ) );
        }
    });
}


/**
 * @description delete tweet. Can only be deleted by author
 * 
 * @param {mongoose.Types.ObjectId} authorId 
 * @param {mongoose.Types.ObjectId} tweetId 
 * @returns json representation of the deleted tweet
 */
const deleteTweet = ( authorId, tweetId ) => {
    return new Promise( (resolve, reject) => {
        if( !tweetId ){
            reject( new InputError( "Missing tweet id" ) );
            return;
        }
        if( !authorId ){
            reject( new UnsupportedError( "Users may only delete their own tweets" ) );
            return;
        }

        Tweet.findOneAndDelete({_id: tweetId, authorId: authorId}).lean()
        .then( (delTweet) => {
            if( !delTweet ){
                reject( new UnsupportedError( "Unable to delete the specified twice. This could be caused by incorrect credentials or the tweet has already been removed") );
            } else {
                resolve( delTweet );
            }
        })
        .catch( (error) => {
            reject( new DatabaseError( error.message ) );
        })
    });
}


module.exports = {
    createTweet,
    getTweet,
    updateTweet,
    deleteTweet
}



