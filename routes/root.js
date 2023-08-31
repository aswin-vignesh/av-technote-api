const express = require("express");
const router = express.Router();
const path = require('path');

// only for route "/" or "/index" or "/index.html" in the regex form
//   ^ (carat) -> at the beggining of the string only 
//   $         -> at the end of the string only 
//   |         -> or
// (. var)?    ->  optional var

router.get('^/$|/index(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname ,'../views','index.html'));
});


module.exports = router;  // app.use(require('./router/root'))