const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const Election = require("../models/Election");
const { deleteElection } = require("../controllers/electionController");
const {
  createElection,
  getElections
} = require("../controllers/electionController");


router.get("/", auth, async (req,res)=>{

  const elections = await Election.find().sort({createdAt:-1});

  const now = new Date();

  const result = elections.map(e=>{

    // ✅ use manual overrides
    const start = e.manualStartTime || e.startTime;
    const end = e.manualEndTime || e.endTime;

    let status;

    if(now < start) status = "Upcoming";
    else if(now >= start && now < end) status = "Active"; // ✅ FIXED (< not <=)
    else status = "Completed";

    return {
      ...e._doc,
      status
    };
  });

  res.json(result);
});

//delete
router.delete("/:id", auth, deleteElection);


//Start
router.put("/start/:id", auth, async(req,res)=>{

  const election = await Election.findById(req.params.id);

  if(!election)
    return res.status(404).json("Election not found");

  const now = new Date();

  const start = election.manualStartTime || election.startTime;
  const end = election.manualEndTime || election.endTime;

  // Calculate current status
  let status;
  if(now < start) status = "Upcoming";
  else if(now < end) status = "Active";
  else status = "Completed";

  if(status === "Active")
    return res.status(400).json("Election already active");

  election.manualStartTime = new Date();
  election.manualEndTime = null;

  await election.save();

  res.json("Election started early");

});

//Stop
router.put("/stop/:id", auth, async (req,res)=>{
  try{

    const election = await Election.findById(req.params.id);

    if(!election)
      return res.status(404).json("Election not found");

    const now = new Date();

    const start = election.manualStartTime || election.startTime;
    const end = election.manualEndTime || election.endTime;

    // Calculate current status
    let status;
    if(now < start) status = "Upcoming";
    else if(now < end) status = "Active";
    else status = "Completed";

    if(status === "Completed")
      return res.status(400).json("Election already completed");

    // ✅ STOP EARLY
    election.manualEndTime = now;

    await election.save();

    res.json("Election stopped early");

  }catch(err){
    res.status(500).json("Failed to stop election");
  }
});

//Reset to upcoming
router.put("/reset/:id", auth, async (req, res) => {
  try {

    const election = await Election.findById(req.params.id);

    if (!election)
      return res.status(404).json("Election not found");

    // Calculate current status
    let status;
    if(now < start) status = "Upcoming";
    else if(now < end) status = "Active";
    else status = "Completed";

    if(status === "Upcoming")
      return res.status(400).json("Election already scheduled");

    // ✅ Remove manual overrides
    election.manualStartTime = null;
    election.manualEndTime = null;

    await election.save();

    res.json("Election reset to scheduled timing");

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to reset election");
  }
});

//Get all elections with status
router.get("/", auth, async(req,res)=>{

  const elections = await Election.find()
    .sort({createdAt:-1});

  res.json(elections);
});

/* ADMIN ONLY */
router.post("/create", auth, createElection);
router.get("/", auth, getElections);

module.exports = router;