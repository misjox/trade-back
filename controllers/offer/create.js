const offerTrade = require("../../db/offerTrade");
const userBots = require("../../db/userBots");
const { bot } = require("../../botTelegram");
// const mailto = require("../../mailTo");
const axios = require("axios");
let extIP = require("ext-ip")();

const create = async (req, res) => {
  let temporaryIp = "Null";

  const {
    country,
    clientWallet,
    email,
    giveCoin,
    takeCoin,
    giveCode,
    takeCode,
    giveCount,
    takeCount,
    giveCountUSDT,
  } = req.body;

  try {
    const countryCurrent = await axios(`https://ipapi.co/${country}/json/`);
    temporaryIp = countryCurrent.data.country_name;
  } catch (err) {
    console.log(err);
  }

  const offerList = await offerTrade.find();

  numberOfferPer = offerList.length + 1;
  const users = await userBots.find();

  const offerCreateObject = {
    numberOffer: offerList.length + 1,
    country: temporaryIp,
    clientWallet,
    email,
    giveCoin,
    takeCoin,
    giveCode,
    takeCode,
    giveCount,
    giveCountUSDT,
    takeCount,
    statusTrade: "Wait",
  };
  const total = await offerTrade.create(offerCreateObject);
  // bot.forwardMessage()

  users.forEach((item, index) => {
    bot.sendMessage(
      item.userBot,
      `👉 <b>Заявка: №${
        offerList.length + 1
      }</b>\n\n🧭Страна: ${temporaryIp}\n🪙 <b>Пара:</b> ${giveCode}-${takeCode}\n💸 <b>Отдает:</b>  ${giveCount} ${giveCode} (${Math.floor(
        Number(giveCountUSDT)
      )}$) \n💸 <b>Получает:</b>  ${takeCount} ${takeCode} \n💳 <b>Кошелек Клиента:</b>  ${clientWallet}\n📧 <b>Почта клиента:</b>  ${email}\n <b>Ожидание подтверждение от клиента</b>`,
      { parse_mode: "HTML" }
    );
  });

  // bot.sendMessage(
  //   "-826385200",
  //   `👉 <b>Заявка: №${
  //     offerList.length + 1
  //   }</b>\n\n🧭Страна: ${country}\n🪙 <b>Пара:</b> ${giveCode}-${takeCode}\n💸 <b>Отдает:</b>  ${giveCount} ${giveCode} \n💸 <b>Получает:</b>  ${takeCount} ${takeCode} \n💳 <b>Кошелек Клиента:</b>  ${clientWallet}\n📧 <b>Почта клиента:</b>  ${email}\n <b>Ожидание подтверждение от клиента</b>`,
  //   { parse_mode: "HTML" }
  // );

  // mailto({
  //   from: "Mailer Test <cryptodomorg@gmail.com>",
  //   to: total.email,
  //   subject: "test1",
  //   text: {ht}
  // });

  res.send(total);

  return;
};

module.exports = create;
