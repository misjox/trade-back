const { Router } = require("express");
const router = Router();
const loggerSchema = require("../db/loggerSchema");
const axios = require("axios");
let extIP = require("ext-ip")();

router.post("/async", async (req, res) => {
  const {ip} = req.body;
  console.log(ip);
  const date = new Date();

  let day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;
  let month =
    date.getMonth() + 1 > 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  let year = date.getFullYear();
  let hour = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
  let minute =
    date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;

  try {
    const ipAlt = await extIP.get();
    console.log("Alt", ipAlt);
    const countryCurrent = await axios(
      `https://ipapi.co/${ip === "Null" ? ipAlt : ip}/json/`
    );

    const result = await loggerSchema.create({
      country: countryCurrent.data.country_name,
      date: {
        day: `${day}`,
        month: `${month}`,
        year: `${year}`,
        hour: `${hour}`,
        minute: `${minute}`,
      },
    });
    // console.log(ip);

    res.send("Ok");
  } catch (err) {
    console.log(err);
  }
  return;
});

module.exports = router;
