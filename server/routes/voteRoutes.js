const router = require("express").Router();
const Vote = require("../models/Vote");
const auth = require("../middleware/authMiddleware");
const isVoter = require("../middleware/voterMiddleware");
const isAdmin = require("../middleware/adminMiddleware"); // optional

const {
  castVote,
  getResults
} = require("../controllers/voteController");

/* CAST VOTE */
router.post("/cast", auth, isVoter, castVote); // ✅ FIXED ORDER

/* GET RESULTS */
// OR (admin only)
router.get("/results/:electionId", auth, getResults);

router.get("/check", auth, isVoter, async (req,res)=>{

  const vote = await Vote.findOne({
    voterId: req.user.id
  });

  res.json({
    voted: !!vote
  });

});



// router.delete("/:id", auth, async(req,res)=>{

//   await Voter.findByIdAndDelete(req.params.id);

//   res.json("Voter deleted");
// });

module.exports = router;