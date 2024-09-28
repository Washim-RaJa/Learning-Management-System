class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        //  This is a method that captures the stack trace (a list of the function calls that led to the error).
        Error.captureStackTrace(this, this.constructor);

    }
}

export default AppError;