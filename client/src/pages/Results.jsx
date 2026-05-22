import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function Results(){

  const [electionId,setElectionId] = useState("");
  const [results,setResults] = useState([]);
  const [elections,setElections] = useState([]);

  const token = localStorage.getItem("token");

  /* ---------------- LOAD ELECTIONS ---------------- */
  const loadElections = async()=>{
    try{
      const res = await api.get("/elections",{
        headers:{Authorization:`Bearer ${token}`}
      });
      setElections(res.data);
    }catch(err){
      alert("Failed to load elections");
    }
  };

  useEffect(()=>{
    loadElections(); // ✅ FIXED
  },[]);

  /* ---------------- LOAD RESULTS ---------------- */
  const loadResults = async(id)=>{
    try{
      const res = await api.get(
        `/votes/results/${id}`,
        { headers:{Authorization:`Bearer ${token}`} }
      );

      // ✅ sort results (highest votes first)
      const sorted = res.data.results.sort((a,b)=>b.votes-a.votes);

      setResults(sorted);

    }catch(err){
      alert(err.response?.data?.message || "Error loading results");
    }
  };

  const winner = results[0];

  // 🔢 total votes
  const totalVotes = results.reduce((sum,r)=>sum+r.votes,0);

  return(
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-6">
        Election Results
      </h1>

      {/* ===== SELECT ELECTION ===== */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <label className="font-semibold">Select Election</label>

        <select
          value={electionId}
          onChange={(e)=>{
            const id = e.target.value;
            setElectionId(id);
            loadResults(id); // ✅ FIXED
          }}
          className="w-full border p-3 rounded-lg mt-2"
        >
          <option value="">Select Election</option>

          {elections.map(e=>(
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>

      </div>

      {/* 🏆 WINNER */}
      {winner && (
        <div className="bg-emerald-100 border border-emerald-400 rounded-xl p-6 mb-8 text-center">

          <h2 className="text-xl font-semibold">
            🏆 Winner
          </h2>

          <h1 className="text-3xl font-bold text-emerald-700 mt-2">
            {winner.name}
          </h1>

          <p className="text-lg">
            {winner.position}
          </p>

          <p className="font-semibold mt-2">
            Votes: {winner.votes}
          </p>

          <p className="text-sm text-gray-600">
            {totalVotes ? ((winner.votes/totalVotes)*100).toFixed(1) : 0}% votes
          </p>

        </div>
      )}

      {/* RESULT LIST */}
      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Result Ranking
        </h2>

        {results.length === 0 && (
          <p className="text-gray-400">No results available</p>
        )}

        {results.map((r,index)=>{

          const percent = totalVotes
            ? ((r.votes/totalVotes)*100).toFixed(1)
            : 0;

          return(
            <div
              key={index}
              className={`p-4 border-b ${
                index===0 ? "bg-emerald-50" : ""
              }`}
            >

              <div className="flex justify-between">

                <div>
                  <h3 className="font-bold">
                    #{index+1} {r.name}
                  </h3>

                  <p className="text-gray-500">
                    {r.position}
                  </p>
                </div>

                <div className="font-semibold text-lg">
                  {r.votes} Votes
                </div>

              </div>

              {/* 📊 Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">

                <div
                  className={`h-3 rounded-full ${
                    index===0 ? "bg-emerald-500" : "bg-indigo-500"
                  }`}
                  style={{ width:`${percent}%` }}
                ></div>

              </div>

              <p className="text-sm text-gray-500 mt-1">
                {percent}%
              </p>

            </div>
          );
        })}

      </div>

    </AdminLayout>
  );
}