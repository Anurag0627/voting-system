const Candidate = require("../models/Candidate");

/* ADD CANDIDATE */
exports.addCandidate = async (req, res) => {
  try {

    const { name, position, electionId } = req.body;

    if (!name || !position || !electionId)
      return res.status(400).send("All fields required");

    const candidate = await Candidate.create({
      name,
      position,
      electionId
    });

    res.json(candidate);

  } catch (err) {
    res.status(500).json(err.message);
  }
};


/* GET CANDIDATES BY ELECTION */
exports.getCandidates = async (req, res) => {
  try {

    const candidates = await Candidate.find({
      electionId: req.params.electionId
    });

    res.json(candidates);

  } catch (err) {
    res.status(500).json(err.message);
  }
};