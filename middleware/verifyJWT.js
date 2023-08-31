// we have given access token and refresh token for the access token but that is not in use
// unless we protect the routes based on those access token

const jwt = require("jsonwebtoken");

const verifyJwt = (req, res , next) =>  {

    const authHeader =  req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')){  // if it does not start with 'Bearer'+' '(space) + all other value 
        return res.status(401).json({message: "Unauthorized"})
    }

    const token = authHeader.split(' ')[1] // after Bearer

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.status(403).json({message : 'Forbidden'}); // if token is expired , should ask a new token inrefresh path
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    )
} 

module.exports = verifyJwt
