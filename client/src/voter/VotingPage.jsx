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

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6">

      {/* HEADER */}

      <div className="text-center mb-10">

        <h1 className="text-5xl font-extrabold mb-3 tracking-wide">

          🗳 Online Election Portal

        </h1>

        <p className="text-gray-300 text-lg">

          Secure • Transparent • Digital Voting

        </p>

      </div>

      {/* TIMER CARD */}

      <div className="max-w-3xl mx-auto mb-8">

        <div className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-3xl p-6 text-center">

          <h2 className="text-2xl font-bold mb-2">

            ⏱ Election Countdown

          </h2>

          <div className="text-4xl font-extrabold text-yellow-300 tracking-widest">

            {timeLeft}

          </div>

        </div>

      </div>

      {/* STATUS */}

      <div className="text-center mb-10">

        {timeLeft === "Voting Closed" ? (

          <div className="inline-block bg-red-500/20 border border-red-400 text-red-200 px-6 py-3 rounded-full font-semibold shadow-lg">

            🔴 Election Closed

          </div>

        ) : (

          <div className="inline-block bg-emerald-500/20 border border-emerald-400 text-emerald-200 px-6 py-3 rounded-full font-semibold shadow-lg animate-pulse">

            🟢 Election Live

          </div>

        )}

      </div>

      {/* CANDIDATES */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {candidates.map(c=>(

          <div

            key={c._id}

            onClick={()=>setSelected(c._id)}

            className={`

              cursor-pointer
              backdrop-blur-xl
              bg-white/10
              border
              rounded-3xl
              p-8
              text-center
              shadow-2xl
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-indigo-500/40

              ${

                selected===c._id

                ? "border-indigo-400 scale-105 ring-4 ring-indigo-500/40"

                : "border-white/10"

              }

            `}

          >

            {/* AVATAR */}

            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-5xl mb-5 shadow-lg">

              👤

            </div>

            {/* NAME */}

            <h2 className="text-2xl font-bold mb-2">

              {c.name}

            </h2>

            {/* POSITION */}

            <p className="text-indigo-200 mb-5 text-lg">

              {c.position}

            </p>

            {/* SELECTED */}

            {selected===c._id && (

              <div className="inline-block bg-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg animate-bounce">

                 Selected

              </div>

            )}

          </div>

        ))}

      </div>

      {/* VOTE BUTTON */}

      <div className="text-center mt-14">

        <button

          onClick={vote}

          disabled={timeLeft === "Voting Closed"}

          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"

        >

          Cast Vote ✅

        </button>

      </div>

    </div>

  );

}