const express = require("express");
const router = express.Router();
const userController = require('../controllers/userControl');
router
  .route("/login")
  .get(userController.getLogin)
  .post(userController.postLogin);

router
  .route("/signup")
  .get(userController.getSignIn)
  .post(userController.postSignIn);

router.get("/logout", userController.getLogout);


module.exports = router;