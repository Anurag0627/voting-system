const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();


app.use(cors({
  origin: "https://voting-system-gamma-peach.vercel.app",
  credentials:true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log(err));

app.listen(5000,()=>{
    console.log("🚀 Server running on 5000");
});


const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const electionRoutes = require("./routes/electionRoutes");
app.use("/api/elections", electionRoutes);

const candidateRoutes = require("./routes/candidateRoutes");
app.use("/api/candidates", candidateRoutes);

const voterRoutes = require("./routes/voterRoutes");
app.use("/api/voters", require("./routes/voterRoutes"));

const voterAuthRoutes = require("./routes/voterAuthRoutes");
app.use("/api/voter-auth", voterAuthRoutes);

const voteRoutes = require("./routes/voteRoutes");
app.use("/api/votes", voteRoutes);
