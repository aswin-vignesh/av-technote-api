// this is a middleware

const {logEvents} = require('./logger');

const errorHandler = (err,req,res,next) => {
    // to errLog.log
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}` , 'errLog.log');
    console.log(err.stack);

    // if statusCode is already set to something else it is server error
    const status = res.statusCode ? res.statusCode : 500 ; // server error

    res.status(status); //setting status

    res.json({message : err.message , isError: true}); // for RTK Query isError

}

module.exports = errorHandler;