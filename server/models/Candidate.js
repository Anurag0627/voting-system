const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  position: {
    type: String,
    required: true
  },

  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true
  }
});

module.exports = mongoose.model("Candidate", candidateSchema);