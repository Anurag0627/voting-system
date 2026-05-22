const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({

  title:String,

  startTime:Date,
  endTime:Date,

  // ✅ manual overrides
  manualStartTime: Date,
  manualEndTime: Date

},{timestamps:true});

module.exports = mongoose.model("Election",electionSchema);