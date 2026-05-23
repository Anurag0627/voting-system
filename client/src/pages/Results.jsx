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

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">

          📊 Election Results

        </h1>

        <p className="text-gray-500 text-lg">

          Monitor rankings, winners and voting analytics.

        </p>

      </div>

      {/* SELECT ELECTION */}

      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-100">

        <label className="font-bold text-lg text-slate-700">

          Select Election

        </label>

        <select

          value={electionId}

          onChange={(e)=>{

            const id = e.target.value;

            setElectionId(id);

            loadResults(id);

          }}

          className="w-full mt-4 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-300"

        >

          <option value="">

            Select Election

          </option>

          {elections.map(e=>(

            <option key={e._id} value={e._id}>

              {e.title}

            </option>

          ))}

        </select>

      </div>

      {/* WINNER CARD */}

      {winner && (

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-2xl p-10 mb-10 relative overflow-hidden">

          <div className="absolute top-0 right-0 text-[120px] opacity-10">

            🏆

          </div>

          <h2 className="text-2xl font-semibold mb-3">

            Winner

          </h2>

          <h1 className="text-5xl font-extrabold mb-2">

            {winner.name}

          </h1>

          <p className="text-xl text-emerald-100 mb-4">

            {winner.position}

          </p>

          <div className="flex flex-wrap gap-6 mt-6">

            <div className="bg-white/20 px-6 py-4 rounded-2xl">

              <p className="text-sm text-emerald-100">

                Votes

              </p>

              <h3 className="text-3xl font-bold">

                {winner.votes}

              </h3>

            </div>

            <div className="bg-white/20 px-6 py-4 rounded-2xl">

              <p className="text-sm text-emerald-100">

                Vote Share

              </p>

              <h3 className="text-3xl font-bold">

                {

                  totalVotes

                  ? ((winner.votes/totalVotes)*100).toFixed(1)

                  : 0

                }%

              </h3>

            </div>

          </div>

        </div>

      )}

      {/* RESULTS LIST */}

      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold text-slate-800">

            Result Rankings

          </h2>

          <div className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-semibold">

            Total Votes: {totalVotes}

          </div>

        </div>

        {results.length===0 && (

          <div className="text-center py-16 text-gray-400 text-lg">

            No results available

          </div>

        )}

        <div className="space-y-6">

          {results.map((r,index)=>{

            const percent = totalVotes

              ? ((r.votes/totalVotes)*100).toFixed(1)

              : 0;

            return(

              <div

                key={index}

                className={`

                  rounded-3xl
                  p-6
                  border
                  shadow-lg
                  transition-all
                  duration-300
                  hover:scale-[1.01]

                  ${

                    index===0

                    ? "bg-emerald-50 border-emerald-300"

                    : "bg-slate-50 border-gray-200"

                  }

                `}

              >

                {/* TOP */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-4">

                  <div className="flex items-center gap-5">

                    {/* RANK */}

                    <div className={`

                      w-16
                      h-16
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      text-2xl
                      font-bold
                      text-white

                      ${

                        index===0

                        ? "bg-emerald-500"

                        : "bg-indigo-500"

                      }

                    `}>

                      #{index+1}

                    </div>

                    {/* INFO */}

                    <div>

                      <h3 className="text-2xl font-bold text-slate-800">

                        {r.name}

                      </h3>

                      <p className="text-gray-500 text-lg">

                        {r.position}

                      </p>

                    </div>

                  </div>

                  {/* VOTES */}

                  <div className="text-right">

                    <h2 className="text-3xl font-extrabold text-slate-800">

                      {r.votes}

                    </h2>

                    <p className="text-gray-500">

                      Votes

                    </p>

                  </div>

                </div>

                {/* PROGRESS */}

                <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

                  <div

                    className={`

                      h-5
                      rounded-full
                      transition-all
                      duration-700

                      ${

                        index===0

                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"

                        : "bg-gradient-to-r from-indigo-500 to-purple-500"

                      }

                    `}

                    style={{

                      width:`${percent}%`

                    }}

                  ></div>

                </div>

                {/* PERCENT */}

                <div className="flex justify-end mt-2">

                  <p className="font-semibold text-gray-600">

                    {percent}%

                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </AdminLayout>

  );
}