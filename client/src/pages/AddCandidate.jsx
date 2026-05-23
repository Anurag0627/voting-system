import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function AddCandidate(){

  /* ------------ STATES ------------ */

  const [name,setName]=useState("");
  const [position,setPosition]=useState("");
  const [electionId,setElectionId]=useState("");

  const [elections,setElections]=useState([]);
  const [message,setMessage]=useState("");

  const token = localStorage.getItem("token");

  /* ------------ LOAD ELECTIONS ------------ */

  const loadElections = async()=>{

    try{

      const res = await api.get("/elections",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      setElections(res.data);

    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    loadElections();
  },[]);

  /* ------------ ADD CANDIDATE ------------ */

  const addCandidate = async()=>{

    if(!name || !position || !electionId){
      setMessage("All fields required");
      return;
    }

    try{

      await api.post(
        "/candidates/add",
        { name, position, electionId },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setMessage("✅ Candidate Added");

      setName("");
      setPosition("");
      setElectionId("");

    }catch(err){
      console.log(err);
      setMessage("❌ Failed to add candidate");
    }
  };

  /* ------------ UI ------------ */

  return(

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">

          🎯 Add Candidate

        </h1>

        <p className="text-gray-500 text-lg">

          Register election candidates securely and efficiently.

        </p>

      </div>

      {/* MAIN CARD */}

      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* TOP BANNER */}

          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-10 text-white">

            <div className="flex items-center gap-5">

              <div className="bg-white/20 p-5 rounded-3xl text-4xl">

                👤

              </div>

              <div>

                <h2 className="text-4xl font-extrabold mb-2">

                  Candidate Registration

                </h2>

                <p className="text-indigo-100 text-lg">

                  Add candidates for upcoming elections

                </p>

              </div>

            </div>

          </div>

          {/* FORM */}

          <div className="p-10">

            {/* MESSAGE */}

            {message && (

              <div className={`

                mb-6
                p-4
                rounded-2xl
                font-medium

                ${

                  message.includes("✅")

                  ? "bg-emerald-100 text-emerald-700"

                  : "bg-red-100 text-red-700"

                }

              `}>

                {message}

              </div>

            )}

            {/* NAME */}

            <div className="mb-6">

              <label className="block text-slate-700 font-bold mb-3 text-lg">

                Candidate Name

              </label>

              <input

                value={name}

                onChange={(e)=>setName(e.target.value)}

                placeholder="Enter candidate name"

                className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"

              />

            </div>

            {/* POSITION */}

            <div className="mb-6">

              <label className="block text-slate-700 font-bold mb-3 text-lg">

                Position

              </label>

              <input

                value={position}

                onChange={(e)=>setPosition(e.target.value)}

                placeholder="President / Secretary"

                className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"

              />

            </div>

            {/* ELECTION */}

            <div className="mb-8">

              <label className="block text-slate-700 font-bold mb-3 text-lg">

                Select Election

              </label>

              <select

                value={electionId}

                onChange={(e)=>setElectionId(e.target.value)}

                className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"

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

            {/* BUTTON */}

            <button

              onClick={addCandidate}

              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 text-white py-4 rounded-2xl text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"

            >

              Add Candidate

            </button>

          </div>

        </div>

      </div>

    </AdminLayout>

  );
}