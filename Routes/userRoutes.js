const express = require('express');

const{ tokenverify }= require('../Middlewares/authMiddleware')
const router = express.Router();
const { registerUser , login ,allUsers} = require('../Controller/userController');
const {otpverify} = require('../Controller/otpverify')
router.route('/').post(registerUser).get(tokenverify , allUsers)
router.route('/login').post(login);
router.route('/verify').get(otpverify)


module.exports = router;