const express = require('express');

const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removefromGroup,
  addToGroup,
} = require("../Controller/ChatController");
const {tokenverify} = require('../Middlewares/authMiddleware')

router.route('/').post(tokenverify , accessChat);
router.route("/").get(tokenverify, fetchChats);
router.route("/group").post(tokenverify, createGroupChat);
router.route("/rename").put(tokenverify, renameGroup);
router.route("/groupremove").post(tokenverify, removefromGroup);
router.route("/groupadd").post(tokenverify, addToGroup);




module.exports = router;