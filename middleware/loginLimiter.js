const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 60s = 1minute
  max: 5,
  message: {
    message:
      "Too Many Login Attempts from this IP , please try again after 60s pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests : ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}\t`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // return rate Limit info in the 'RateLimit-*' headers
  legacyHeaders:false // disable 'X-RateLimit-*' headers
});

module.exports = loginLimiter;
