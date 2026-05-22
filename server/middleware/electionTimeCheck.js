const Election = require("../models/Election");

module.exports = async (req, res, next) => {

  const { electionId } = req.body;

  const election = await Election.findById(electionId);

  if (!election)
    return res.status(404).send("Election not found");

  const now = new Date();

  if (now < election.startTime)
    return res.send("Voting not started yet");

  if (now > election.endTime)
    return res.send("Voting ended");

  next();
};