const express = require("express");
const router = require("express").Router();
const Voter = require("../models/Voter");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const { addVoter } = require("../controllers/voterController");
const getStatus = require("../utils/getElectionStatus");

/* ADMIN ONLY */
router.post("/add", auth, addVoter);

/* GET VOTERS (OPTIONAL FILTER) */
router.get("/", auth, async (req,res)=>{

  try{

    const { electionId } = req.query;

    let filter = {};

    if(electionId){
      filter.electionId = electionId;
    }

    const voters = await Voter.find(filter)
      .populate("electionId","title");

    res.json(voters);

  }catch(err){
    res.status(500).json("Failed to fetch voters");
  }
});

/* DELETE VOTER */

router.delete("/:id", auth, async (req,res)=>{

  try{

    await Voter.findByIdAndDelete(req.params.id);

    res.json({ message:"Voter deleted successfully" });

  }catch(err){

    console.log(err);
    res.status(500).json("Delete failed");

  }

});

/* GET VOTER BY ID */

router.get("/:id", async (req,res)=>{

  const voter = await Voter.findById(req.params.id)
    .populate("electionId");

  if(!voter){
    return res.status(404).json({ message:"Voter not found" });
  }

  const election = voter.electionId;

  // ✅ if no election assigned
  if(!election){
    return res.json({
      ...voter.toObject(),
      electionId: null
    });
  }

  const status = getStatus(election);

  res.json({
    ...voter.toObject(),
    electionId: {
      ...election.toObject(),
      status
    }
  });

});

module.exports = router;

