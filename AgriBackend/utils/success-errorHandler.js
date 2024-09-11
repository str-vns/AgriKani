const {STATUSCODE} = require("../constants/index")
class ErrorHandler extends Error {
    constructor (statusCode = STATUSCODE.BADREQ, message)
    {
        super(message);
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor);
    }

     toJSON(){
        return {
            Success: false,
            error: {
                message: this.message
            },
        };
     }
}

const SuccessHandler = (res, message, details) =>
{
    res.statusCode(STATUSCODE.SUCCESS).json({
        Success: true, 
        message,
        details
    });
};

module.exports = {
    ErrorHandler, 
    SuccessHandler
}