const TelegramBot = require("node-telegram-bot-api");
const userBots = require("./db/userBots");
const offerTrade = require("./db/offerTrade");
const logger = require("./db/loggerSchema");
const { default: axios } = require("axios");
const token = process.env.TOKENBOT;

const bot = new TelegramBot(token, {
  polling: { autoStart: true, params: { allowed_updates: true } },
  // testEnvironment: true,
});

// bot.setWebHook(process.env.SERVER_URL, { max_connections: 1 });

const COMMANDS = {
  TRADE: "/trade",
  START: "/start",
  REGISTER: "/register",
  MONEY_TEAM: "/money_team",
  RESERVE: "/reserve",
  DELETE_USER: "/delete_user",
  ADD_ROLE_MODER: "/add_role_moder",
  ADD_ROLE_ADMIN: "/add_role_admin",
  DEL_ROLE_USER: "/del_role_user",
  LIST_TEAM: "/list_team",
  LOGS: "/logs",
  LAST_MONTH: "/last_month",
};

bot.setMyCommands(
  JSON.stringify([
    {
      command: "/register",
      description: "Начать работу, если тебе разрешат администраторы",
    },
  ])
);

const routerBotMessage = async (msg) => {
  // View all offerTrade
  if (msg.text === COMMANDS.TRADE) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role === "Moder" || user.role === "Admin") {
      const offerTradeList = await offerTrade.find();

      let filterTradeList = [];

      if (offerTradeList.length > 3) {
        filterTradeList = offerTradeList.slice(-3, offerTradeList.length);
      } else {
        filterTradeList = offerTradeList;
      }

      const listTrade = filterTradeList.map((offer) => {
        return `👉 <b>Заявка: №${offer.numberOffer}</b>\n🪙 <b>Пара: </b>${offer.giveCode}-${offer.takeCode}\n📧 <b>Почта клиента:</b> ${offer.email}\n\n⏱ <b>Статус заявки:</b> ${offer.statusTrade}\n\n`;
      });

      if (listTrade.length === 0) {
        bot.sendMessage(msg.chat.id, "В данный момент нет заявок");
        return;
      }

      bot.sendMessage(
        msg.chat.id,
        `Последние 3 заявки:\n\n ${listTrade.join("")}`,
        {
          parse_mode: "HTML",
        }
      );
      filterTradeList = [];
    } else {
      return bot.sendMessage(msg.chat.id, "У вас нет прав для этого");
    }
  }

  if (msg.text === COMMANDS.LOGS) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role === "Admin") {
      const loggerList = await logger.find();

      let filterLoggerList = [];

      if (loggerList.length > 3) {
        filterLoggerList = loggerList.slice(-3, loggerList.length);
      } else {
        filterLoggerList = loggerList;
      }

      const listLogger = filterLoggerList.map((item) => {
        return `👉 <b>Посещение сайта:</b>\n<b>🛰 Страна:</b> ${item.country}\n<b>🕰 Время:</b> ${item.date.day}.${item.date.month}.${item.date.year}-${item.date.hour}:${item.date.minute}\n\n`;
      });

      if (listLogger.length === 0) {
        bot.sendMessage(msg.chat.id, "В данный момент нет логов");
        return;
      }

      bot.sendMessage(
        msg.chat.id,
        `Последние логи:\n\n ${listLogger.join("")}`,
        {
          parse_mode: "HTML",
        }
      );
      filterLoggerList = [];
    } else {
      return bot.sendMessage(msg.chat.id, "У вас нет прав для этого");
    }
  }
  if (msg.text === COMMANDS.LAST_MONTH) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role === "Admin") {
      const loggerList = await logger.find();

      let filterLoggerList = [];

      if (loggerList.length > 30) {
        filterLoggerList = loggerList.slice(-30, loggerList.length);
      } else {
        filterLoggerList = loggerList;
      }
      const objTemp = {};

      filterLoggerList.forEach((item) => {
        if (!Object.hasOwn(objTemp, item.country)) {
          objTemp[item.country] = 1;
        } else {
          objTemp[item.country] = objTemp[item.country] + 1;
        }
      });

      const resultListLastMonth = [];
      for (itemObj in objTemp) {
        resultListLastMonth.push({ contry: itemObj, score: objTemp[itemObj] });
      }

      const listLogger = resultListLastMonth.map((item) => {
        return `🛰 <b>${item.contry}</b>: ${item.score} \n\n`;
      });

      if (listLogger.length === 0) {
        bot.sendMessage(msg.chat.id, "В данный момент нет логов");
        return;
      }

      bot.sendMessage(
        msg.chat.id,
        `Последние логи за 30 дней:\n\n ${listLogger.join("")}`,
        {
          parse_mode: "HTML",
        }
      );
      filterLoggerList = [];
    } else {
      return bot.sendMessage(msg.chat.id, "У вас нет прав для этого");
    }
  }

  // Start Bot
  if (msg.text === COMMANDS.START) {
    bot.sendMessage(msg.chat.id, 'Для начала работы с ботом нажмите "Меню" ');
  }

  // Register new user
  if (msg.text === COMMANDS.REGISTER) {
    const result = await userBots.findOne({ userBot: msg.chat.id });
    if (result)
      return bot.sendMessage(msg.chat.id, "Такой пользователь уже есть");

    const users = await userBots.find();

    temporaryId = msg.chat.id;
    temporaryName = msg.chat.first_name;
    temporaryUsername = msg.chat.username;
    users.forEach((item) => {
      if (item.role !== "Admin") return;

      bot.sendMessage(
        item.userBot,
        `К нам пытает добавиться ${msg.chat.first_name} c ником ${msg.chat.username}. Что вы хотите ему ответить ?`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Разрешить",
                  callback_data: JSON.stringify({
                    type: "register",
                    res: "accept",
                    id: String(msg.chat.id),
                  }),
                },
                {
                  text: "Запретить",
                  callback_data: JSON.stringify({
                    type: "register",
                    res: "unaccept",
                  }),
                },
              ],
              [
                {
                  text: "Заблокировать",
                  callback_data: JSON.stringify({
                    type: "register",
                    res: "ban",
                  }),
                },
              ],
            ],
          },
        }
      );
    });

    return;
  }

  if (msg.text === COMMANDS.MONEY_TEAM) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    const users = await userBots.find();
    const usersMoney = await Promise.all(
      users.map(async (item) => {
        const nameUser = await bot.getChat(item.userBot);
        if (item?.money?.length === 0) {
          return `<b>${nameUser?.first_name}</b>:\nИтоговая сумма: 0$\nОбработанные заявки: 0\n\n`;
        } else {
          const resultMoney = item.money.reduce((prev, current) => {
            if (current.procent === undefined) return prev + 0;
            return prev + current.procent;
          }, 0);
          // console.log(resultMoney);
          return `<b>${nameUser?.first_name}</b>:\nИтоговая сумма: ${resultMoney}$\nОбработанные заявки: ${item.money.length}\n\n`;
        }
      })
    );
    bot.sendMessage(msg.chat.id, usersMoney.join(""), { parse_mode: "HTML" });
    return;
  }

  if (msg.text === COMMANDS.RESERVE) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role !== "Admin")
      return bot.sendMessage(
        msg.chat.id,
        "У вас нет прав на выполнение данного действия"
      );

    const response = await axios(`${process.env.SERVER_URL}/api/reserve`);
    const resultList = response.data.docs.map(
      (item) => `💳<b>${item.title}:</b> ${item.reserve}\n`
    );

    bot.sendMessage(
      msg.chat.id,
      `📋<b>Список монет:</b>\n\n${resultList.join("")}`,
      { parse_mode: "HTML" }
    );
    return;
  }

  if (msg.text === COMMANDS.DELETE_USER) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role !== "Admin")
      return bot.sendMessage(msg.chat.id, "У вас нет прав на выдачу ролей");

    const users = await userBots.find();

    const userDeleteDataList = [];
    await Promise.all(
      users.map(async (us) => {
        const dataUserBot = await bot.getChat(us.userBot);
        userDeleteDataList.push(dataUserBot);
      })
    );

    bot.sendMessage(msg.chat.id, "Кого вы хотите удалить?", {
      reply_markup: {
        inline_keyboard: userDeleteDataList.map((item) => [
          {
            text: `${item.first_name}(${item.username})`,
            callback_data: JSON.stringify({
              type: "deleteUser",
              id: item.id,
            }),
          },
        ]),
      },
    });

    return;
  }

  if (msg.text === COMMANDS.ADD_ROLE_MODER) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role !== "Admin")
      return bot.sendMessage(msg.chat.id, "У вас нет прав на выдачу ролей");

    const users = await userBots.find();

    const userAddRoleModerDataList = [];
    await Promise.all(
      users.map(async (us) => {
        const dataUserBot = await bot.getChat(us.userBot);
        userAddRoleModerDataList.push(dataUserBot);
      })
    );

    bot.sendMessage(msg.chat.id, "Кому вы хотите выдать роль Модера?", {
      reply_markup: {
        inline_keyboard: userAddRoleModerDataList.map((item) => [
          {
            text: `${item.first_name}(${item.username})`,
            callback_data: JSON.stringify({
              type: "addRoleModer",
              id: item.id,
            }),
          },
        ]),
      },
    });

    return;
  }

  if (msg.text === COMMANDS.ADD_ROLE_ADMIN) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role !== "Admin")
      return bot.sendMessage(msg.chat.id, "У вас нет прав на выдачу ролей");

    const users = await userBots.find();

    const userAddRoleAdminDataList = [];
    await Promise.all(
      users.map(async (us) => {
        const dataUserBot = await bot.getChat(us.userBot);
        userAddRoleAdminDataList.push(dataUserBot);
      })
    );

    bot.sendMessage(msg.chat.id, "Кому вы хотите выдать роль Админа?", {
      reply_markup: {
        inline_keyboard: userAddRoleAdminDataList.map((item) => [
          {
            text: `${item.first_name}(${item.username})`,
            callback_data: JSON.stringify({
              type: "addRoleAdmin",
              id: item.id,
            }),
          },
        ]),
      },
    });

    return;
  }

  if (msg.text === COMMANDS.DEL_ROLE_USER) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role !== "Admin")
      return bot.sendMessage(msg.chat.id, "У вас нет прав на выдачу ролей");

    const users = await userBots.find();

    const userDelRoleAdminDataList = [];
    await Promise.all(
      users.map(async (us) => {
        const dataUserBot = await bot.getChat(us.userBot);
        userDelRoleAdminDataList.push(dataUserBot);
      })
    );

    bot.sendMessage(msg.chat.id, "Кому вы хотите выдать роль User?", {
      reply_markup: {
        inline_keyboard: userDelRoleAdminDataList.map((item) => [
          {
            text: `${item.first_name}(${item.username})`,
            callback_data: JSON.stringify({
              type: "delRoleUser",
              id: item.id,
            }),
          },
        ]),
      },
    });

    return;
  }

  if (msg.text === COMMANDS.LIST_TEAM) {
    const user = await userBots.findOne({ userBot: msg.chat.id });

    if (!user) return bot.sendMessage(msg.chat.id, "Вы не состоите в команде.");

    if (user.role === "Moder" || user.role === "Admin") {
      const listTeam = await userBots.find();

      const userNames = await Promise.all(
        listTeam.map(async (item) => {
          const nameTeam = await bot.getChat(item.userBot);
          return `<b>${nameTeam.first_name}:</b>\nРоль - "${item.role}"\nВсего заявок: ${item.money.length}\n\n`;
        })
      );

      bot.sendMessage(
        msg.chat.id,
        `<b>В команде ${listTeam.length} сотрудников:</b>\n\n${userNames.join(
          ""
        )}`,
        {
          parse_mode: "HTML",
        }
      );
      return;
    } else {
      bot.sendMessage(msg.chat.id, "У вас нет прав для этого");
    }

    return;
  }

  let isNot = true;
  for (commandItem in COMMANDS) {
    if (COMMANDS[commandItem] === msg.text) {
      isNot = false;
    }
  }
  if (isNot) {
    bot.sendMessage(msg.chat.id, "Вы не знаете, как использовать бота?", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Узнать",
              callback_data: JSON.stringify({ type: "/start" }),
            },
          ],
        ],
      },
    });
  }

  return;
};
// TEMPORARY VARIABLES

bot.on("callback_query", async (msg) => {
  const jsonData = JSON.parse(msg.data);

  // Delete user
  if (jsonData.type === "deleteUser") {
    await userBots.findOneAndRemove({ userBot: jsonData.id });
    const name = await bot.getChat(jsonData.id);
    bot.sendMessage(
      msg.message.chat.id,
      `Пользователь ${name.first_name} был(а) удален(а)`
    );
    bot.setMyCommands(
      JSON.stringify([
        {
          command: "/register",
          description: "Начать работу, если тебе разрешат администраторы",
        },
      ]),
      { scope: { type: "chat", chat_id: jsonData.id } }
    );
    return;
  }

  // Registration new user
  if (jsonData.type === "register") {
    if (jsonData.res === "accept") {
      await userBots.create({ userBot: jsonData.id, money: [], role: "User" });

      bot.sendMessage(jsonData.id, "Вы добавлены в нашу команду");
      bot.setMyCommands(
        JSON.stringify([
          {
            command: "/money_team",
            description: "Посмотреть зарaботок сотрудников",
          },
        ]),
        { scope: { type: "chat", chat_id: jsonData.id } }
      );
      // bot.setMyCommands;
      bot.sendMessage(
        msg.message.chat.id,
        `Вы разрешили вход ид ${jsonData.id}`
      );
      return;
    }
    if (jsonData.res === "unaccept") {
      bot.sendMessage(jsonData.id, "Вам запретили вход");

      bot.sendMessage(
        msg.message.chat.id,
        `Вы запретили вход ид ${jsonData.id}`
      );
      return;
    }
    if (jsonData.res === "ban") {
      bot.sendMessage(jsonData.id, "Вам выдали бан");
      bot.sendMessage(msg.message.chat.id, `Вы забанили ид ${jsonData.id}`);
      return;
    }
  }

  // Add role Moder user
  if (jsonData.type === "addRoleModer") {
    await userBots.findOneAndUpdate(
      { userBot: jsonData.id },
      { role: "Moder" }
    );
    const name = await bot.getChat(jsonData.id);
    bot.sendMessage(
      msg.message.chat.id,
      `Пользователю ${name.first_name} была выдана роль Модер`
    );
    bot.setMyCommands(
      JSON.stringify([
        {
          command: "/trade",
          description: "Посмотреть список предложений",
        },
        {
          command: "/money_team",
          description: "Посмотреть зарaботок сотрудников",
        },
      ]),
      { scope: { type: "chat", chat_id: jsonData.id } }
    );
    return;
  }

  // Add role Admin user
  if (jsonData.type === "addRoleAdmin") {
    await userBots.findOneAndUpdate(
      { userBot: jsonData.id },
      { role: "Admin" }
    );
    const name = await bot.getChat(jsonData.id);
    bot.sendMessage(
      msg.message.chat.id,
      `Пользователю ${name.first_name} была выдана роль Админ`
    );

    bot.setMyCommands(
      JSON.stringify([
        {
          command: "/register",
          description: "Начать работу, если тебе разрешат администраторы",
        },
        {
          command: "/trade",
          description: "Посмотреть список предложений",
        },
        {
          command: "/reserve",
          description: "Посмотреть список монет",
        },
        {
          command: "/logs",
          description: "Посмотреть последние логи",
        },
        {
          command: "/last_month",
          description: "Посмотреть трафик за 30 дней",
        },
        {
          command: "/money_team",
          description: "Посмотреть заработок сотрудников",
        },
        {
          command: "/list_team",
          description: "Посмотреть список сотрудников",
        },
        {
          command: "/add_role_moder",
          description: "Выдача пользователю роль Moder",
        },
        {
          command: "/add_role_admin",
          description: "Выдача пользователю роль Admin",
        },
        {
          command: "/del_role_user",
          description: "Понижение пользователя до роли User",
        },
        {
          command: "/delete_user",
          description: "Удалить пользователя из команды",
        },
      ]),
      { scope: { type: "chat", chat_id: jsonData.id } }
    );
    return;
  }

  // Delete role Admin user
  if (jsonData.type === "delRoleUser") {
    await userBots.findOneAndUpdate({ userBot: jsonData.id }, { role: "User" });
    const name = await bot.getChat(jsonData.id);
    bot.sendMessage(
      msg.message.chat.id,
      `Пользователю ${name.first_name} была выдана роль User`
    );
    bot.setMyCommands(
      JSON.stringify([
        {
          command: "/money_team",
          description: "Посмотреть заработок сотрудников",
        },
      ]),
      { scope: { type: "chat", chat_id: jsonData.id } }
    );
    return;
  }

  // Start command
  if (jsonData.type === "/start") {
    bot.sendMessage(
      msg.message.chat.id,
      `Для использования бота нажмите на кнопку "МЕНЮ"`
    );
    return;
  }
});

module.exports = { bot, routerBotMessage };
