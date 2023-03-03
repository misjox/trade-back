const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const logger = Schema({
  country: {
    type: String,
    required: true,
  },
  date: {
    day: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
    minute: {
      type: String,
      required: true,
    },
  },
});

const loggerSchema = model("logs", logger);

module.exports = loggerSchema;
