const offerTrade = require("../../db/offerTrade");
const userBots = require("../../db/userBots");

const { bot } = require("../../botTelegram");

let arrayTrade = [];

bot.on("callback_query", async (msg) => {
  let type;
  let res;
  let id;
  try {
    const jsonData = JSON.parse(msg.data);
    type = jsonData.type;
    res = jsonData.res;
    id = jsonData.id;
  } catch (err) {
    return;
  }
  if (type !== "trade") return;

  const users = await userBots.find();

  if (res === "accept") {
    await offerTrade.updateOne({ _id: id }, { statusTrade: "Accept Trade" });
    const updateOffer = await offerTrade.findById(id);

    const currentTeam = users.find(
      (team) => team.userBot === String(msg.message.chat.id)
    );

    await userBots.findOneAndUpdate(
      { userBot: msg.message.chat.id },
      {
        money: [
          ...currentTeam.money,
          {
            idOffer: updateOffer.id,
            procent: Number(updateOffer.giveCountUSDT) * 0.15,
          },
        ],
      }
    );

    arrayTrade.forEach((item) => {
      bot.editMessageReplyMarkup(
        {
          inline_keyboard: [
            [
              {
                text: "Ожидание выплаты",
                callback_data: JSON.stringify({ type: "undefined" }),
              },
            ],
          ],
        },

        {
          chat_id: item.ChatId,
          message_id: item.MessageId,
          // inline_message_id: msg.inline_message_id,
        }
      );
    });
    arrayTrade = [];
    return;
  } else if (res === "fail") {
    await offerTrade.updateOne({ _id: id }, { statusTrade: "Fail Trade" });
    const updateOffer = await offerTrade.findById(id);

    const currentTeam = users.find(
      (team) => team.userBot === String(msg.message.chat.id)
    );

    await userBots.findOneAndUpdate(
      { userBot: msg.message.chat.id },
      {
        money: [
          ...currentTeam.money,
          {
            idOffer: updateOffer.id,
            procent: 0,
          },
        ],
      }
    );

    arrayTrade.forEach((item) => {
      bot.editMessageReplyMarkup(
        {
          inline_keyboard: [
            [
              {
                text: "Обратитесь в тех поддержку",
                callback_data: JSON.stringify({ type: "undefined" }),
              },
            ],
          ],
        },

        {
          chat_id: item.ChatId,
          message_id: item.MessageId,
          // inline_message_id: msg.inline_message_id,
        }
      );
    });
    arrayTrade = [];
    return;
  }
});

const acceptTrade = async (req, res) => {
  const { id, status } = req.body;
  const users = await userBots.find();

  const result = await offerTrade.updateOne(
    { _id: id },
    { statusTrade: status }
  );
  const total = await offerTrade.findOne({ _id: id });

  users.forEach((item) => {
    if (item.role === "Moder" || item.role === "Admin") {
      bot
        .sendMessage(
          item.userBot,
          `👉 <b>Заявка: №${total.numberOffer}</b>\n\n🧭Страна: ${
            total.country
          }\n🪙 <b>Пара:</b> ${total.giveCode}-${
            total.takeCode
          }\n💸 <b>Отдает:</b>  ${total.giveCount} ${
            total.giveCode
          } (${Math.floor(
            Number(total.giveCountUSDT)
          )}$) \n💸 <b>Получает:</b>  ${total.takeCount} ${
            total.takeCode
          } \n💳 <b>Кошелек клиента:</b>  ${
            total.clientWallet
          } \n💳 <b>Кошелек получатель:</b>  ${
            total.giveCoin.payment
          } \n📧 <b>Почта клиента:</b>  ${total.email}`,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Ожидание выплаты",
                    callback_data: JSON.stringify({
                      type: "trade",
                      res: "accept",
                      id: total._id,
                    }),
                  },
                  {
                    text: "Обратитесь в тех поддержку",
                    callback_data: JSON.stringify({
                      type: "trade",
                      res: "fail",
                      id: total._id,
                    }),
                  },
                ],
              ],
            },
          }
        )
        .then((mes) => {
          arrayTrade.push({
            ChatId: mes.chat.id,
            MessageId: mes.message_id,
          });
        });
    }
  });

  res.send({ id: id, status: total.statusTrade });
  return;
};

module.exports = acceptTrade;
