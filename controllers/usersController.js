const User = require('../models/User');
const Note = require('../models/Note');

const bcrypt = require('bcrypt');

// @desc Get all Users
// @route GET /users
// @access private

const getAllUsers =  async (req,res) => {
    const users = await User.find().select('-password').lean() // '-password' leave the password field

    if(!users?.length){ // optional chaining if users not null check length
        return res.status(400).json({message : 'No Users Found'});
    }
    res.json(users);
} ;


// @desc create user
// @route POST /users
// @access private

const createUser =  async (req,res) => {
    const {username,password,roles} = req.body;

    // confirm data
    if( !username || !password ){
        return res.status(400).json({message : 'All fields are Required'});
    }
    
    // check duplicates
    const duplicate = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec(); // exec just recommended in docs if we pass something to check
    
    if(duplicate){ // 409 - conflict
        return res.status(409).json({message : 'Duplicate Username'});
    }
    
    // hash password
    const hashPwd = await bcrypt.hash(password , 10); //salt =10

    // object
    // const userObj = {username , 'password' : hashPwd , roles} ; // new User {username:username , 'password' : hashPwd , roles:roles}
    const userObj =
      (!Array.isArray(roles) || !roles.length)
        ? { username, password: hashPwd }
        : { username, password: hashPwd, roles };  
    

    // storing new user
    const user = await User.create(userObj) ; // or .insertOne() or userObj.save()
    
    if(user){
        return res.status(201).json({message : `new User ${username} created`});
    }else{
        return res.status(400).json({message : `Invalid user data received`});
    }
} ;

// @desc update user
// @route PATCH /users
// @access private

const updateUser =  async (req,res) => {
    
    const {id,username,password,active,roles} = req.body;

    // confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof(active) !== 'boolean'){
        return res.status(400).json({message : 'All fields are Required'});
    }

    const user = await User.findById(id).exec();  // exec just recommended in docs if we pass something to check

    if(!user){
        return res.status(400).json({message : 'User Not Found'});
    }
    
    // check duplicates
    const duplicate = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec(); // exec just recommended in docs
    
    if(duplicate && duplicate?._id.toString() !== id){ // 409 - conflict
        return res.status(409).json({message : 'Duplicate Username'});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password){
        user.password = await bcrypt.hash(password,10);
    }

    const updatedUser = await user.save(); // if there is .lean() we cannot save like this

    console.log(updatedUser);

    res.json({message : `Updated ${user.username}`});
} ;

// @desc delete user
// @route DELETE /users
// @access private

const deleteUser =  async (req,res) => {
    
    const {id} = req.body;

    if(!id){
        return res.status(400).json({message:'User Id is Required'});
    }

    // we Do not want to delete  if they have some notes assigned

    const note = await  Note.findOne({user:id}).lean().exec();

    if(note){
        return res.status(400).json({message:'User has Assigned Notes'});
    }
    
    const user = await User.findById(id).exec();
    
    if(!user){
        return res.status(400).json({message:'User Not Found'});
    }
    const result = await user.deleteOne(); // deleting the user that we got not the User model and returns the deleted user

    const reply =  `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);
} ;



module.exports = {getAllUsers , createUser , updateUser , deleteUser};


