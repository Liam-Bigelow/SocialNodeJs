
const express = require("express");
const router = express.Router();

const {ensureAuth} = require("./middleware/authentication.middleware" ); // assuming all tweets operations need to be authenticated first

const controller = require( "../controllers/social.controller");

/**
 * -- Task ---
 * 
 * - Create, read, update, delete tweet
*/


router.post( "/tweet", ensureAuth, (req, res) => {
    controller.createTweet( req.user._id, req.user.username, req.body.message )
    .then( (newTweet) => {
        res.status( 200 ).json( newTweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).send( error );
    });
});

router.get( "/tweet/:tweetId", ensureAuth, (req, res) => {
    controller.getTweet( req.params.tweetId )
    .then( (tweet) => {
        res.status( 200 ).json( tweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).send( error );
    });
});

router.put( "/tweet/:tweetId", ensureAuth, (req, res) => {
    controller.updateTweet( req.user._id, req.params.tweetId, req.body.message )
    .then( (updatedTweet) => {
        res.status( 200 ).json( updatedTweet );
    })
    .catch( (error) => {
        console.error( error );
        res.status( error.status ? error.status: 500 ).send( error );
    });
});

router.delete( "/tweet/:tweetId", ensureAuth, (req, res) => {
});



module.exports = router;