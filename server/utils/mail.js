const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }

});

exports.sendMail = async(to, subject, text)=>{

  await transporter.sendMail({

    from: "Online Voting <anuragkumbhar13@gmail.com>",

    to,
    subject,
    text

  });

};