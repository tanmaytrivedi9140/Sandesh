const express = require('express');
const { tokenverify } = require('../Middlewares/authMiddleware');
const { sendMessage, allMessages } = require('../Controller/messageController');

const router = express.Router();

router.route('/').post(tokenverify  , sendMessage)

router.route("/:chatId").get(tokenverify, allMessages);



module.exports = router;