const express = require("express");
const router = express.Router();
const usersController = require('../controllers/usersController')
const verifyJwt = require('../middleware/verifyJWT');

router.use(verifyJwt); 

router.route('/') // already in /users and this is users

.get(usersController.getAllUsers)
.post(usersController.createUser)
.patch(usersController.updateUser)
.delete(usersController.deleteUser);

module.exports = router;