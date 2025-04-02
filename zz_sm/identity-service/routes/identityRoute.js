const express = require('express')
const {registerUser,loginUser,refreshTokenController,logoutUser} = require('../controllers/identityController')
const router = express.Router()

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/refreshToken',refreshTokenController);
router.post('/logout',loginUser);

module.exports =  router