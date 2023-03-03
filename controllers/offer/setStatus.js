const offerTrade = require("../../db/offerTrade");

const setStatus = async (req, res) => {
  const { id, status } = req.body;

  const result = await offerTrade.updateOne(
    { _id: id },
    { statusTrade: status }
  );

  res.send({ id: id, status: result.statusTrade });
  return;
};

module.exports = setStatus;
