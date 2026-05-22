const Voter = require("../models/Voter");
const Vote = require("../models/Vote");
const Election = require("../models/Election");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../utils/mail");

/* LOGIN + SEND OTP */
const getStatus = require("../utils/getElectionStatus");

exports.loginVoter = async (req, res) => {

  try {
    const { email, password } = req.body;

    const voter = await Voter.findOne({ email }).populate("electionId");

    if (!voter)
      return res.status(400).json({ message: "Voter not found" });

    const election = voter.electionId;

    // ✅ STATUS CHECK (correct place)
    const status = getStatus(election);

    if(status !== "Active"){
      return res.status(400).json({
        message: `Election is ${status}. You cannot login now`
      });
    }

    /* password check */
    const match = await bcrypt.compare(password, voter.password);

    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    const alreadyVoted = await Vote.findOne({
      voterId: voter._id,
      electionId: voter.electionId
    });
    
    console.log(alreadyVoted);
    
    if(alreadyVoted){
      return res.status(400).json({
        message: "Already Voted"
      });
    }

    /* generate OTP */
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.deleteMany({ voterId: voter._id });

    await Otp.create({
      voterId: voter._id,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    /* send OTP email */
    await sendMail(
      voter.email,
      "Voting OTP Verification",
      `Your OTP is: ${otp}`
    );

    res.json({
      message: "OTP sent to email",
      voterId: voter._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const jwt = require("jsonwebtoken");

/* VERIFY OTP */

exports.verifyOTP = async (req, res) => {

  try {

    let { voterId, otp } = req.body;

    if (!voterId || !otp) {
      return res.status(400).send("Missing voterId or otp");
    }

    otp = String(otp).trim();

    const record = await Otp.findOne({ voterId })
      .sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).send("OTP not found");
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).send("OTP expired");
    }

    if (String(record.otp) !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    /* DELETE OTP */
    await Otp.deleteMany({ voterId });

    /* CREATE TOKEN */
    const token = jwt.sign(
      {
        id: voterId,
        role: "voter"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "OTP verified",
      token,
      role: "voter"
    });

  } catch (err) {

    console.log(err);
    res.status(500).json("Server error");

  }

};