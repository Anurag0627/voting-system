import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function ManageElections(){

  const [elections,setElections]=useState([]);
  const token = localStorage.getItem("token");

  const load = async()=>{

    const res = await api.get("/elections",{
      headers:{Authorization:`Bearer ${token}`}
    });

    setElections(res.data);
  };

  useEffect(()=>{

  load(); // first load

  const interval = setInterval(()=>{
    load();
  },5000); // refresh every 5 seconds

  return ()=>clearInterval(interval);

},[]);

  /* CONTROLS */

  const startElection = async(id)=>{
  const confirmStart = window.confirm("Start this election?");
  if(!confirmStart) return;
  await api.put(`/elections/start/${id}`,{},{
    headers:{Authorization:`Bearer ${token}`}
  });
  load();
};

  const stopElection = async(id)=>{
    const confirmStop = window.confirm("Stop this election?");
    if(!confirmStop) return;
    await api.put(`/elections/stop/${id}`,{},{
      headers:{Authorization:`Bearer ${token}`}
    });
    load();
  };

  const resetElection = async(id)=>{
    const confirmReset = window.confirm("Reset this election?");
    if(!confirmReset) return;
    await api.put(`/elections/reset/${id}`,{},{
      headers:{Authorization:`Bearer ${token}`}
    });
    load();
  };

  const deleteElection = async(id)=>{
    const confirmDel = window.confirm("Delete this election?");
    if(!confirmDel) return;
    await api.delete(`/elections/${id}`,{
      headers:{Authorization:`Bearer ${token}`}
    });
    load(); 
  };

  return(
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-8">
        Manage Elections
      </h1>

      <div className="space-y-6">

        {elections.length === 0 && (
          <p className="text-gray-400">No elections available</p>
        )}

        {elections.map(e=>(
          <div
            key={e._id}
            className="bg-white shadow-lg rounded-xl p-6"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-bold text-gray-800">
                {e.title}
              </h2>

              <span className={`px-4 py-1 rounded-full text-white font-semibold
                ${
                  e.status==="Active"
                  ? "bg-emerald-500"
                  : e.status==="Upcoming"
                  ? "bg-yellow-500"
                  : "bg-red-500"
                }`}>
                {e.status}
              </span>

            </div>

            {/* TIME INFO */}
            <div className="text-gray-600 mb-6">

              <p>
                <strong>Start:</strong>{" "}
                {new Date(e.startTime).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}
              </p>

              <p>
                <strong>End:</strong>{" "}
                {new Date(e.endTime).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}
              </p>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 flex-wrap">

              <button
                onClick={()=>startElection(e._id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transform hover:scale-105 active:scale-95
                          active:bg-emerald-900
                          transition-all duration-150"
              >
                Start Election
              </button>

              <button
                onClick={()=>stopElection(e._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 active:scale-95
                          active:bg-red-900
                          transition-all duration-150"
              >
                Stop Election
              </button>

              <button
                onClick={()=>resetElection(e._id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 active:scale-95
                          active:bg-yellow-900
                          transition-all duration-150"
              >
                Reset
              </button>

              <button
                onClick={()=>deleteElection(e._id)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transform hover:scale-105 active:scale-95
                          active:bg-gray-900
                          transition-all duration-150"
              >
                Delete
              </button>

            </div>

            

          </div>
        ))}

          

      </div>

    </AdminLayout>
  );
}