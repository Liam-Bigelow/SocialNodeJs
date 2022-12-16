

/**
 * Simple user schema
 * 
 * Only needs a username and password right now
*/

const mongoose = require("mongoose" );
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

mongoose.model("User", User);