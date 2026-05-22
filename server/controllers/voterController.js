const Voter = require("../models/Voter");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../utils/mail");
const Election = require("../models/Election");

/* ADD SINGLE VOTER */
exports.addVoter = async (req, res) => {

  try {
    const { name, email, electionId } = req.body;

    if (!name || !email || !electionId)
      return res.status(400).send("All fields required");

    /* generate random password */
    const plainPassword = Math.random()
      .toString(36)
      .slice(-8);

    const hashedPassword =
      await bcrypt.hash(plainPassword, 10);

    const voter = await Voter.create({
      name,
      email,
      password: hashedPassword,
      electionId
    });

    const election = await Election.findById(electionId);
    const sTime = await election.startTime
    const eTime = await election.endTime
    const eTitle = await election.title

    /* send credential mail */
    try {

      await sendMail(
        email,
        "College Election Voting Credentials",
        `
        Hello ${name},

        You are registered for ${eTitle} election.

        Login Link:
        https://voting-system-gamma-peach.vercel.app/voter-login

        Email: ${email}
        Password: ${plainPassword}
        Election Time: [ ${sTime.toLocaleString()} ] to [ ${eTime.toLocaleString()} ]

        Login only during election time.
        `
      );

      console.log("Mail sent");

    } catch(mailErr){

      console.log("MAIL ERROR:", mailErr);

    }

    res.json({
      message: "Voter added and mail sent",
      voter
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};