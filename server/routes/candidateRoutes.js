const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const getStatus = require("../utils/getElectionStatus");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");

/* ADD CANDIDATE */

router.post("/add", auth, async (req,res)=>{

  try{

    const { name, position, electionId } = req.body;

    const election = await Election.findById(electionId);

    if(!election)
      return res.status(404).json("Election not found");

    /* 🚫 BLOCK COMPLETED ELECTION */

    const now = new Date();

    const start = election.manualStartTime || election.startTime;
    const end = election.manualEndTime || election.endTime;

    let status;

    if(now < start) status = "Upcoming";
    else if(now >= start && now < end) status = "Active";
    else status = "Completed";

    if(status === "Completed" || status === "Active"){
      return res
        .status(400)
        .json("Cannot add candidate to completed or active election");
    }



    const candidate = await Candidate.create({
      name,
      position,
      electionId
    });

    res.json(candidate);

  }catch(err){
    console.log(err);
    res.status(500).json("Failed to add candidate");
  }
});

/* GET GROUPED CANDIDATES */
router.get("/grouped", auth, async (req, res) => {
  try {

    const elections = await Election.find();
    const result = [];

    for (const election of elections) {

      const candidates = await Candidate.find({
        electionId: election._id
      });

      // ✅ SAME LOGIC AS MANAGE ELECTIONS
      const now = new Date();

      const start = election.manualStartTime || election.startTime;
      const end = election.manualEndTime || election.endTime;

      let status;

      if(now < start) status = "Upcoming";
      else if(now >= start && now < end) status = "Active";
      else status = "Completed";

      result.push({
        electionId: election._id,
        electionTitle: election.title,
        status, // ✅ dynamic status
        startTime: election.startTime,
        endTime: election.endTime,
        candidates
      });
    }

    res.json(result);

  } catch (err) {
    console.log("Grouped Candidates Error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* GET CANDIDATES BY ELECTION */
router.get("/:electionId", async (req, res) => {
  try {

    const candidates = await Candidate.find({
      electionId: req.params.electionId
    });

    res.json(candidates);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Delete candidates
router.delete("/:id", auth, async (req, res) => {
  try {

    await Candidate.findByIdAndDelete(req.params.id);

    res.json({ message: "Candidate deleted successfully" });

  } catch (err) {

    console.log(err);
    res.status(500).json("Delete failed");

  }
});

module.exports = router;