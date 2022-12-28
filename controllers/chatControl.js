const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/user");
const Message = require('../models/client')

exports.getUser = async (req, res, next) => {
  try {
    const token = await req.session.token;
    const data = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.find();
    await res.render("user", { data: user, email: data.email });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getHome = async (req, res, next) => {
  try {
    const token = await req.session.token;
    const data = await User.find();
    const data1 = await jwt.verify(token, process.env.SECRET_KEY);
    const result = await User.find({ email: data1.email });
    const x = await result.map((p) => p._id);
    await res.render("home", { data: data, userId: x, sender: data1.name });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const token = await req.session.token;
    const data = await jwt.verify(token, process.env.SECRET_KEY);
    const result = await User.findOne({ email: data.email });
    await res.render("me", { data: result });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const recieverName = await req.query.name;
    const token = await req.session.token;
    const user = await jwt.verify(token, process.env.SECRET_KEY);
    const data = await User.findOne({ email: user.email });
    const senderName = await data.userName;
    const senderUserId = await data._id;
    const data2 = await User.findOne({ userName: recieverName });
    const recieverUserId = await data2._id;
    
    const result = await Message.find({
      $or: [
        {
          $and: [
            { senderUserId: senderUserId },
            { recieverUserId: recieverUserId },
          ],
        },
        {
          $and: [
            { senderUserId: recieverUserId },
            { recieverUserId: senderUserId },
          ],
        },
      ],
    });
    const user1 = await User.find();
    const room = await result.map((p) => p.room)[0];
    console.log('room',room)
    await res.render("chat", {
      data: JSON.stringify(result),
      sendername: senderName,
      recievername: recieverName,
      senderUserId: senderUserId,
      recieverUserId: recieverUserId,
      users: user1,
      room: room,
    });
  } catch (error) {
    console.log("Error", error);
  }
};
