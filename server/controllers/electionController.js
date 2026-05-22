const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const Voter = require("../models/Voter");

/* CREATE ELECTION */
exports.createElection = async (req, res) => {
  try {

    const { title, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime)
      return res.status(400).send("All fields required");

    const sTime = new Date(startTime);
    const eTime = new Date(endTime);

    // ❌ Invalid time check
    if(sTime >= eTime){
      return res.status(400).json("Start time must be before end time");
    }

    if(sTime <= new Date() || eTime <= new Date()){
      return res.status(400).json("Start time or end time is wrong");
    }

    // 🔥 OVERLAP CHECK
    const conflict = await Election.findOne({
      $or: [
        {
          startTime: { $lt: eTime },
          endTime: { $gt: sTime }
        }
      ]
    });

    if(conflict){
      return res.status(400).json("Election already scheduled in this time range");
    }

    const election = await Election.create({
      title,
      startTime: sTime,
      endTime: eTime
    });

    res.json(election);

  } catch (err) {
    res.status(500).json(err.message);
  }
};


/* GET ALL ELECTIONS */
exports.getElections = async (req,res)=>{ 

  const elections = await Election.find();
  const now = new Date();

  const updated = elections.map(e => {

    const start = e.manualStartTime || e.startTime;
    const end = e.manualEndTime || e.endTime;

    let status;

    if(now < start) status = "Upcoming";
    else if(now >= start && now < end) status = "Active"; // ✅ FIXED
    else status = "Completed";

    return {
      ...e._doc,
      status
    };

  });

  res.json(updated);
};


// Delete Elections with all
exports.deleteElection = async (req, res) => {

  try {

    const electionId = req.params.id;

    /* delete candidates linked to this election */
    await Candidate.deleteMany({ electionId: electionId });

    /* delete voters linked to this election */
    await Voter.deleteMany({ electionId: electionId });

    /* delete election */
    await Election.findByIdAndDelete(electionId);

    res.json("Election and related data deleted");

  } catch (err) {

    console.log(err);
    res.status(500).json("Delete failed");

  }

};