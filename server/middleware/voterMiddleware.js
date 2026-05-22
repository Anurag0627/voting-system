module.exports = (req,res,next)=>{

  if(!req.user){
    return res.status(401).json("Access denied");
  }

  if(req.user.role !== "voter"){
    return res.status(403).json("Voters only");
  }

  next();
};