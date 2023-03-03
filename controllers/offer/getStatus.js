const offerTrade = require("../../db/offerTrade");

const getStatus = async (req, res) => {
  const { id } = req.body;

  const result = await offerTrade.findOne({ _id: id });

  res.send({ id: id, status: result.statusTrade });
  return;
};

module.exports = getStatus;
