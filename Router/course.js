const { Router } = require("express");
const router = Router();
const axios = require("axios");

router.post("/get", async (req, res) => {
  const { giveMoney, takeMoney } = req.body;

  const result = await axios(
    `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=${giveMoney}&convert=${takeMoney}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY_COIN,
      },
    }
  );
  res.send(result.data);
  return;
});

module.exports = router;
