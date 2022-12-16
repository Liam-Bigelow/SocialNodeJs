


const ensureAuthenticated = (req, res, next) => {
    // req.user means that user is in session and for a user to be in session it must be a valid user so we 
    // only need to check if the user is in the session to know that the user is valid
    if( req.user ){
        return next();
    } else {
        res.redirect( "/" );
    }
}


module.exports = {
    ensureAuthenticated
}