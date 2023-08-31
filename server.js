require('dotenv').config();
require('express-async-errors') // instead express-async-handler
const express = require('express');                     // default 
const app = express();
const path = require('path');
const {logger,logEvents} = require('./middleware/logger');        // logger
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');                           // cors
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');           //DB
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

connectDB();

// logging details
app.use(logger);

app.use(cors(corsOptions)); // cors middleware making access to public when app.use(cors())

app.use(express.json()); // middleware to parse json

app.use(cookieParser()); // to parse the cookies that we receieve

// to look onto the static files like css or other resources : he uses path from node  
app.use(express.static('public')); // or app.use('/', express.static(path.join(__dirname , 'public')));


// ROUTING

// connect the root js for make routing over there 
app.use(require('./routes/root'));  // app.use('/',require('./routes/root'));
// Autentication Route
app.use('/auth',require('./routes/authRoutes'));
// DB User routing
app.use('/users',require('./routes/userRoutes'));
// DB Note routing
app.use('/notes',require("./routes/noteRoutes"));



// all other routes
app.all('*',(req,res) => {
    res.status(404); // we are setting status and it does not send now , sends only afte .json or .send
    
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname , 'views/404.html'));
    }else if(req.accepts('json')){
        res.json({message: '404 Not Found'});  // sends response immediately
    }else{
        // send txt if nothing is accepted or expected
        res.type('txt').send('404 Not Found');
    }
})

// logging the errors with error handler middleware
app.use(errorHandler);


mongoose.connection.once('open', ()=> { // listening for open event
    console.log('connected to mongodb');
    app.listen(PORT, ()=> {
        console.log('Server started at PORT '+PORT);
    });
});

// getting db connenction errors here , server errors are handled above
mongoose.connection.on('error', (err)=> {
    console.log(err);
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}` , 'mongoErrLog.log');
})
