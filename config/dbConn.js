const mongoose  = require('mongoose');

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URI);
    }catch(e){
        console.log(e);
    }
}

module.exports = connectDB;