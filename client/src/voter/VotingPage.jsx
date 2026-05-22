import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function VotingPage(){

  const navigate = useNavigate();

  const [candidates,setCandidates] = useState([]);
  const [selected,setSelected] = useState(null);
  const [timeLeft,setTimeLeft] = useState("");

  const voterId = localStorage.getItem("voterId");

  /* LOAD DATA */
  useEffect(()=>{

    const loadData = async()=>{

      try{

        const voterRes = await api.get(`/voters/${voterId}`);

        const election = voterRes.data.electionId;

        if(!election){
          alert("No election assigned");
          return;
        }

        if(election.status !== "Active"){
          alert("Election is not active");
          window.location="/voter-login";
          return;
        }

        const candidateRes = await api.get(
          `/candidates/${election._id}`
        );

        setCandidates(candidateRes.data);

        /* TIMER */

        const end = new Date(election.endTime);

        const timer = setInterval(()=>{

          const diff = end - new Date();

          if(diff <= 0){
            setTimeLeft("Voting Closed");
            clearInterval(timer);
            return;
          }

          const h=Math.floor(diff/1000/60/60);
          const m=Math.floor(diff/1000/60)%60;
          const s=Math.floor(diff/1000)%60;

          setTimeLeft(`${h}h ${m}m ${s}s`);

        },1000);

        return ()=>clearInterval(timer);

      }catch(err){

        console.log(err);

      }

    };

    loadData();

  },[]);

  /* CAST VOTE */

  const vote = async()=>{

    if(!selected){
      alert("Select a candidate");
      return;
    }

    try{

      const token = localStorage.getItem("token");

      if(!token){
        alert("Session expired. Please login again");
        navigate("/voter-login");
        return;
      }

      console.log("TOKEN:", token);

      await api.post(
        "/votes/cast",
        {
          candidateId:selected
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      
      localStorage.removeItem("token");
      navigate("/thank-you", { replace:true });

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Voting failed"
      );

    }

  };

  return(

    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}

      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-indigo-600">
          🗳 College Election Voting
        </h1>

        <p className="text-gray-600 mt-2">
          Select your candidate and cast your vote
        </p>

      </div>

      {/* TIMER */}

      <div className="bg-white shadow rounded-xl p-4 text-center mb-10">

        <h2 className="text-lg font-semibold">

          ⏱ Voting Ends In:

          <span className="text-red-500 ml-2">
            {timeLeft}
          </span>

        </h2>

      </div>

      {/* STATUS */}

      <div className="mb-6 text-center">

        {timeLeft === "Voting Closed" ? (

          <div className="bg-red-100 text-red-600 p-3 rounded">
            🔴 Election Closed
          </div>

        ) : (

          <div className="bg-emerald-100 text-emerald-700 p-3 rounded">
            🟢 Election Live
          </div>

        )}

      </div>

      {/* CANDIDATES */}

      <div className="grid grid-cols-3 gap-8">

        {candidates.map(c=>(

          <div
            key={c._id}
            onClick={()=>setSelected(c._id)}
            className={`cursor-pointer bg-white shadow rounded-xl p-6 text-center transition
            ${
              selected===c._id
              ? "border-4 border-indigo-600 scale-105"
              : "hover:scale-105"
            }`}
          >

            <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-4xl mb-4">
              👤
            </div>

            <h2 className="text-xl font-bold">
              {c.name}
            </h2>

            <p className="text-gray-500 mb-4">
              {c.position}
            </p>

            {selected===c._id && (
              <p className="text-indigo-600 font-semibold">
                Selected
              </p>
            )}

          </div>

        ))}

      </div>

      {/* BUTTON */}

      <div className="text-center mt-10">

        <button
          onClick={vote}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl text-lg shadow"
        >
          Cast Vote ✅
        </button>

      </div>

    </div>

  );

}