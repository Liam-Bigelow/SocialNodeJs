
const express = require("express");
const router = express.Router();

const {ensureAuthenticated} = require("./middleware/authentication.middleware" ); // assuming all tweets operations need to be authenticated first

const controller = require( "../controllers/social.controller");

/**
 * -- Task ---
 * 
 * - Create, read, update, delete tweet
*/


router.post( "/tweet", ensureAuthenticated, (req, res) => {
    controller.createTweet( req.user.id, req.user.username, req.body.message )
    .then( (newTweet) => {
        res.status( 200 ).json( newTweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).json( error );
    });
});


router.get( "/tweet/:tweetId", ensureAuthenticated, (req, res) => {
    controller.getTweet( req.params.tweetId )
    .then( (tweet) => {
        res.status( 200 ).json( tweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).json( error );
    });
});


router.put( "/tweet/:tweetId", ensureAuthenticated, (req, res) => {
    controller.updateTweet( req.user.id, req.params.tweetId, req.body.message )
    .then( (updatedTweet) => {
        res.status( 200 ).json( updatedTweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).json( error );
    });
});


router.delete( "/tweet/:tweetId", ensureAuthenticated, (req, res) => {
    controller.deleteTweet( req.user.id, req.params.tweetId )
    .then( (deletedTweet) => {
        res.status( 200 ).json( deletedTweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).json( error );
    });
});



module.exports = router;