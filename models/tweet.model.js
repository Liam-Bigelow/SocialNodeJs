

/**
 * Simple tweet schema
 * 
 * Only needs a a way to identify the poster as well as the message
*/

const mongoose = require("mongoose" );
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    authorId: {
        required: true,
        type: Schema.Types.ObjectId
    },
    authorUsername: {
        required: true,
        type: String
    },
    message: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

mongoose.model("Tweet", TweetSchema);