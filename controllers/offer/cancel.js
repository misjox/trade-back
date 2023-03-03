const offerTrade = require("../../db/offerTrade");

const cancel = async (req, res) => {
  const { id } = req.body;

  const result = await offerTrade.updateOne(
    { _id: id },
    { statusTrade: "Cancel Trade" }
  );

  res.send({ id: result._id, message: "Cancel Trade" });
  return;
};

module.exports = cancel;
