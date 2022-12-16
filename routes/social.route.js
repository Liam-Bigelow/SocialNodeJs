
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
});

router.get( "/tweet/:tweetId", ensureAuth, (req, res) => {
});

router.put( "/tweet/:tweetId", ensureAuth, (req, res) => {
});

router.delete( "/tweet/:tweetId", ensureAuth, (req, res) => {
});



module.exports = router;