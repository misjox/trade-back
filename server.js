const express = require("express");
const payload = require("payload");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const offer = require("./Router/offer");
const logger = require("./Router/logger");
const course = require("./Router/course");
const { bot, routerBotMessage } = require("./botTelegram");

app.use(cors());
app.use(bodyParser.json());
// --- API ROUTER ---

app.use("/payment", offer);
app.use("/logger", logger);
app.use("/course", course);

// bot.on("photo", (msg) => {
//   bot.getFileLink(msg.photo[msg.photo.length - 1].file_id).then((result) => {
//     console.log(result);
//   });
// });

bot.on("message", routerBotMessage);

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here
// io.listen(3000);
app.listen(8000);
