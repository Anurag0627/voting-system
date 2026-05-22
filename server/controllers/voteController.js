const mongoose = require("mongoose");

const Election = require("../models/Election");
const Vote = require("../models/Vote");
const Voter = require("../models/Voter");
const Candidate = require("../models/Candidate");
const getStatus = require("../utils/getElectionStatus");

exports.castVote = async (req,res)=>{

  try{

    /* GET VOTER FROM TOKEN */
    const voterId = req.user.id;

    const { candidateId } = req.body;

    const voter = await Voter.findById(voterId);

    if(!voter){
      return res.status(404).json({
        message:"Voter not found"
      });
    }

    const election = await Election.findById(
      voter.electionId
    );

    /* SECURITY CHECK */

    const status = getStatus(election);

    if(status !== "Active"){
      return res.status(403).json({
        message:"Election is not active"
      });
    }

    /* PREVENT DOUBLE VOTING */

    const alreadyVoted = await Vote.findOne({
      voterId,
      electionId:voter.electionId
    });

    if(alreadyVoted){
      return res.status(400).json({
        message:"You already voted"
      });
    }

    /* SAVE VOTE */

    await Vote.create({
      voterId,
      candidateId,
      electionId:voter.electionId
    });

    res.json({
      message:"Vote Successful"
    });

  }catch(err){

    console.log(err);

    res.status(500).json({
      message:"Voting failed"
    });

  }

};
// results
exports.getResults = async (req,res)=>{

  try{

    const election = await Election.findById(req.params.electionId);

    if(!election){
      return res.status(404).json({ message:"Election not found" });
    }

    // ❌ block if not completed
    if(getStatus(election) !== "Completed"){
      return res.status(400).json({
        message:"Results not available yet"
      });
    }

    const candidates = await Candidate.find({
      electionId: election._id
    });

    const results = [];

    for(const c of candidates){

      const count = await Vote.countDocuments({
        candidateId: c._id
      });

      results.push({
        name: c.name,
        position: c.position,
        votes: count
      });
    }

    // 🏆 winner
    const winner = results.reduce((a,b)=>
      b.votes > a.votes ? b : a
    );

    res.json({
      results,
      winner
    });

  }catch(err){
    console.log(err);
    res.status(500).json({ message:"Failed to fetch results" });
  }
};