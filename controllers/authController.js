const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



// @desc Login
// @route POST /auth
// @access Public
const login =  async(req,res) => {

// initial verification of username and password

    const { username , password }  = req.body;

    if(!username || !password){
        return res.status(400).json({message : 'All fields are required'});
    }

    const foundUser = await User.findOne({username}).exec();
    
    if(!foundUser || !foundUser.active){ // to deactivate user from protected paths
        return res.status(401).json({message : 'Unauthorized'});
    }

    const match = await bcrypt.compare(password , foundUser.password)

    if(!match){
        return res.status(401).json({message : 'Unauthorized'});
    }

// if here the userid and pass is verified
// Creating Access, refresh token , and secure httpOnly cookie 

    const accessToken = jwt.sign(
        {
            "UserInfo" : {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : '15m'}
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username  },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn : '7d'}
    )

    // create secure cookie with refresh token

    // this refresh token should not be saved in user application so httpOnly
    res.cookie('jwt' , refreshToken , { 
        httpOnly: true, //access only by web browser
        secure : true, // https
        sameSite: 'None', // cross site cookie is possible (backend and frontend has different servers)
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week expiry

    })

    // send access token with username and roles
    res.json({accessToken})
    
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh =  async(req,res) => {

    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({message : 'Unauthorized'})

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,

         async(err, decoded) => {  // already verification is done here but if there is err we get here

            if(err) return res.status(403).json({message : 'Forbidden'});

            const foundUser = await User.findOne({username : decoded.username})

            if(!foundUser ) return res.status(401).json({message : 'Unauthorized'});

            // new access token if refresh token is valid
            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '15m'}
            )

            res.json({accessToken});
        } )
    
    
}

// @desc Logout
// @route GET /auth/logout
// @access Public - just to clear cookie if exists
const logout =  async(req,res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204) //  no content
    res.clearCookie('jwt' , {httpOnly: true , sameSite : 'None' , secure : true})
    res.json({message: 'Cookies cleared'})
}

module.exports = {
    login,refresh,logout
}