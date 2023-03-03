const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const offerTradeSchema = Schema({
  numberOffer: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  clientWallet: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  giveCoin: {
    type: Object,
    required: true,
  },
  takeCoin: {
    type: Object,
    required: true,
  },
  giveCode: {
    type: String,
    required: true,
  },
  takeCode: {
    type: String,
    required: true,
  },
  giveCount: {
    type: String,
    required: true,
  },
  giveCountUSDT: {
    type: String,
    required: true,
  },
  takeCount: {
    type: String,
    required: true,
  },
  statusTrade: {
    type: String,
    required: true,
  },
});

const offerTrade = model("offerTrade", offerTradeSchema);

module.exports = offerTrade;
