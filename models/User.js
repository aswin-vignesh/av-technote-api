const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    roles : {
        type : [String],
        default : ["Employee"]
    },
    active : {  // for admins to immediately remove the access
        type : Boolean,
        default : true
    }
});

// we are directly exporting the model which can be used to create object and store in db
module.exports = mongoose.model("User",userSchema);