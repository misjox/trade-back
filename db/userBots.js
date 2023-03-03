const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userBotsSchema = Schema({
  userBot: { type: String, required: true },
  money: {
    type: Array,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const userBots = model("userBots", userBotsSchema);

module.exports = userBots;
