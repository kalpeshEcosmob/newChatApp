const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.getSignIn = (req, res, next) => {
  res.render("signup");
};

exports.postSignIn = async (req, res, next) => {
  try {
    const email = await req.body.email;
    const username = await req.body.userName;
    const password = await req.body.password;
    const confirmPassword = await req.body.confirmPassword;
    const role = await req.body.role;

    await console.log("data", username, password, confirmPassword);

    const hashed = await bcrypt.hash(password, 12);

    const user = await new User({
      email: email,
      userName: username,
      password: hashed,
      confirmPassword: confirmPassword,
      role: role,
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log("Error in post login", error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = await req.body.email;
    const password = await req.body.password;
    const data = await User.findOne({ email: email });
    const mongoPassword = data.password;
    const result = await bcrypt.compare(password, mongoPassword);
    if (result === true) {
      useris = {
        email: data.email,
        name: data.userName,
        role: data.role,
      };
      const token = await jwt.sign(useris, process.env.SECRET_KEY);
      const x = await token;
      req.session.token = await x;
      return res.redirect("/home");
    }
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("err", err);
    }
    console.log("Session deleted");
    res.render("login");
  });
};
