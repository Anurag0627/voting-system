const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

exports.sendMail = async(to, subject, text)=>{

  try{

    const response = await resend.emails.send({

      from: "onboarding@resend.dev",

      to,

      subject,

      text

    });

    console.log("MAIL RESPONSE:", response);

  }catch(err){

    console.log("MAIL ERROR:", err);

  }

};