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
    <AdminLayout >

      <h1 className="text-3xl font-bold mb-6 pl-45 max-w-xl mx-auto">
        Add Candidate
      </h1>

      <div className="bg-white shadow rounded-xl p-6 max-w-xl mx-auto">

        {message && (
          <p className="mb-4 text-red-600">{message}</p>
        )}

        <label className="font-medium">Candidate Name</label>
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Enter candidate name"
        />

        <label className="font-medium">Position</label>
        <input
          value={position}
          onChange={(e)=>setPosition(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="President / Secretary"
        />

        <label className="font-medium">Select Election</label>
        <select
          value={electionId}
          onChange={(e)=>setElectionId(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6"
        >
          <option value="">Select Election</option>

          {elections.map(e=>(
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}

        </select>

        <button
          onClick={addCandidate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transform hover:scale-105 active:scale-95
                          active:bg-indigo-900
                          transition-all duration-150"
        >
          Add Candidate
        </button>

      </div>

    </AdminLayout>
  );
}