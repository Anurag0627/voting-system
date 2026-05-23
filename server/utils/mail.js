const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 465,

  secure: true,

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS

  },

  family: 4, // force IPv4

  tls: {
    rejectUnauthorized: false
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000

});

exports.sendMail = async(to, subject, text)=>{

  try{

    console.log("Sending mail to:", to);

    const info = await transporter.sendMail({

      from: `Online Voting <${process.env.EMAIL_USER}>`,

      to,

      subject,

      text

    });

    console.log("MAIL SENT:", info.messageId);

  }catch(err){

    console.log("MAIL ERROR:", err);

  }

};