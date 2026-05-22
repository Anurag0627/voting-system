const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: "Voter" },
  otp: String,
  expiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Otp", otpSchema);