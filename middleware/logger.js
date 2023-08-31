// this is a middleware

const { format } = require("date-fns");
const { v4: uuid } = require("uuid"); // v4 is renamed as uuid
const fs = require("fs");
const fsPromises = fs.promises; // require('fs').promises
const path = require("path");

// creates dircetory/file if not present and generates date , id , message inside that file
const logEvents = async (message, logFileName) => {

  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;  // specific uuid for each log item

  try {
    if (!fs.existsSync(path.join(__dirname , "..", "logs"))) {
      // is logs folder doesnt exists create them
      await fsPromises.mkdir(path.join(__dirname , "../", "logs"));
    }
    // once directory is available
    // append logItem (data) or create if the file doesnt exist
    await fsPromises.appendFile(
      path.join(__dirname , "..", "logs", logFileName),
      logItem
    );
  } catch (e) {
    console.log(e);
  }
};

// middleware
const logger = (req, res, next) => {
  // we are calling above logEvents from here
  // message , filename
  const message = `${req.method}\t${req.url}\t${req.headers.origin}`;


  logEvents(message, "reqLog.log");
  console.log(`${req.method} ${req.path}`); // just for reference

  next(); // callback
};

module.exports = { logEvents, logger };
