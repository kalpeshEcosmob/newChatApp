const express = require("express");
const router = express.Router();
const chatController = require('../controllers/chatControl')

router.get("/user", chatController.getUser);

router.get("/me", chatController.getMe);

router.get("/", chatController.getChat);

router.get("/home", chatController.getHome);

module.exports = router;
