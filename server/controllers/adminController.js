const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Election = require("../models/Election");
const Voter = require("../models/Voter");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");

/* REGISTER ADMIN (RUN ONLY ONCE) */
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hash,
    });

    res.json(admin);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* LOGIN ADMIN */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).send("Admin not found");

    const match = await bcrypt.compare(password, admin.password);

    if (!match) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getStats = async (req, res) => {

  try {

    const elections = await Election.countDocuments();
    const candidates = await Candidate.countDocuments();
    const voters = await Voter.countDocuments();
    const votes = await Vote.countDocuments();

    res.json({
      elections,
      candidates,
      voters,
      votes
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to load stats");
  }
};