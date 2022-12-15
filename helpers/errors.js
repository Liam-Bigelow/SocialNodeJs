
/**
 * Creating a simple custom error class for more comprehensive error handling
 */

class DatabaseError extends Error {
    constructor( message ){
        super( message );
        this.status = 500;
    }
}

class InputError extends Error {
    constructor( message ){
        super( message );
        this.status = 400;
    }
}