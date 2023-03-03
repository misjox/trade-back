const offerTrade = require("../../db/offerTrade");
const getOne = async (req, res) => {
  const { id } = req.body;

  const result = await offerTrade.findOne({ _id: id });

  res.send(result);
  return;
};

module.exports = getOne;
