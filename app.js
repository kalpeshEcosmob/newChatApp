const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const errorController = require("./controllers/errorControl");
const Message = require("./models/client");
const User = require("./models/user");
const db =
  "mongodb+srv://ChatProject1:ChatProject1@chatproject1.8m9sfvv.mongodb.net/newChatApp?retryWrites=true&w=majority";

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;

const store = new MongoDBStore({
  uri: db,
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(userRoutes);
app.use(chatRoutes);
app.use(errorController.get404);

mongoose.set("strictQuery", true);
mongoose
  .connect(db)
  .then(async () => {
    await http.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to the database", err);
  });

// Socket
io.on("connection", async (socket) => {
  socket.on("send-message", async (data) => {
    const value = await Message.find({
      $or: [
        {
          $and: [
            { senderUserId: data.senderUserId },
            { recieverUserId: data.recieverUserId },
          ],
        },
        {
          $and: [
            { senderUserId: data.recieverUserId },
            { recieverUserId: data.senderUserId },
          ],
        },
      ],
    });
    const user = await User.find({ userName: data.senderId });
    const Id = await user.map((p) => p._id);
    const revuser = await User.find({ userName: data.recieverId });
    const revId = revuser.map((p) => p._id);

    if (value.length == 0) {
      const msg = await new Message({
        message: data.message,
        senderUserId: Id,
        recieverUserId: revId,
        room: Math.random(),
      });
      msg.save();

      socket
        .to(data.room)
        .emit("message", { message: data.message, name: data.senderId });
    } else {
      const room = value[0].room;
      const msg = await new Message({
        message: data.message,
        senderUserId: Id,
        recieverUserId: revId,
        room: room,
      });
      msg.save();
      socket
        .to(data.room)
        .emit("message", { message: data.message, name: data.senderId });
    }
  });
});