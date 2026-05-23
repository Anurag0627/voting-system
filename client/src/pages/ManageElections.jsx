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

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">

          🗳 Manage Elections

        </h1>

        <p className="text-gray-500 text-lg">

          Control election activity, status and lifecycle.

        </p>

      </div>

      {/* EMPTY */}

      {elections.length===0 && (

        <div className="bg-white rounded-3xl shadow-xl p-16 text-center text-gray-400 text-xl">

          No elections available

        </div>

      )}

      {/* ELECTION GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {elections.map(e=>(

          <div

            key={e._id}

            className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:scale-[1.01] transition-all duration-300"

          >

            {/* TOP */}

            <div className="flex justify-between items-start mb-6 gap-4">

              <div>

                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">

                  {e.title}

                </h2>

                <p className="text-gray-500">

                  Election Management Panel

                </p>

              </div>

              {/* STATUS */}

              <div className={`

                px-5
                py-2
                rounded-full
                text-white
                font-bold
                shadow-lg

                ${

                  e.status==="Active"

                  ? "bg-emerald-500"

                  : e.status==="Upcoming"

                  ? "bg-yellow-500"

                  : "bg-red-500"

                }

              `}>

                {e.status}

              </div>

            </div>

            {/* TIME SECTION */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

              {/* START */}

              <div className="bg-slate-100 rounded-2xl p-5">

                <p className="text-gray-500 mb-2 font-medium">

                   Start Time

                </p>

                <h3 className="font-bold text-slate-800 text-lg leading-relaxed">

                  {

                    new Date(e.startTime).toLocaleString(

                      "en-IN",

                      {

                        timeZone:"Asia/Kolkata",

                        dateStyle:"medium",

                        timeStyle:"short"

                      }

                    )

                  }

                </h3>

              </div>

              {/* END */}

              <div className="bg-slate-100 rounded-2xl p-5">

                <p className="text-gray-500 mb-2 font-medium">

                  ⏱ End Time

                </p>

                <h3 className="font-bold text-slate-800 text-lg leading-relaxed">

                  {

                    new Date(e.endTime).toLocaleString(

                      "en-IN",

                      {

                        timeZone:"Asia/Kolkata",

                        dateStyle:"medium",

                        timeStyle:"short"

                      }

                    )

                  }

                </h3>

              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <button

                onClick={()=>startElection(e._id)}

                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"

              >

                 Start

              </button>

              <button

                onClick={()=>stopElection(e._id)}

                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"

              >

                 Stop

              </button>

              <button

                onClick={()=>resetElection(e._id)}

                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"

              >

                 Reset

              </button>

              <button

                onClick={()=>deleteElection(e._id)}

                className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"

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