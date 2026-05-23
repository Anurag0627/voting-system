const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000

});

exports.sendMail = async(to, subject, text)=>{

  console.log("Sending mail to:", to);

  const info = await transporter.sendMail({

    from: "Online Voting <yourgmail@gmail.com>",

    to,
    subject,
    text

  });

  console.log("MAIL RESPONSE:", info);

};