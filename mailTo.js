const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  //   port: 993,
  secure: false,
  auth: {
    user: "cryptodomorg@gmail.com",
    pass: "cryptodom1991",
  },
});

const mailto = (message) => {
  transporter.sendMail(message, (err, info) => {
    console.log(err);
    console.log(info);
  });
};

module.exports = mailto;
