
/**
 * Creating a simple custom error class for more comprehensive error handling
 */

class DatabaseError extends Error {
    constructor( message ){
        super( message );
        this.msg = message;
        this.status = 500;
    }
}

class InputError extends Error {
    constructor( message ){
        super( message );
        this.msg = message;
        this.status = 400;
    }
}

class UnsupportedError extends Error {
    constructor( message ){
        super( message );
        this.msg = message;
        this.status = 400;
    }
}


module.exports = {
    DatabaseError,
    InputError,
    UnsupportedError
}