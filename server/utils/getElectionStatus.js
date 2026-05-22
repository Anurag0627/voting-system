module.exports = function getElectionStatus(e){

  const now = new Date();

  const start = e.manualStartTime || e.startTime;
  const end = e.manualEndTime || e.endTime;

  if(now < start) return "Upcoming";
  if(now >= start && now <= end) return "Active";
  return "Completed";

}