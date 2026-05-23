import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";

export default function ManageCandidates(){

  const [data,setData]=useState([]);

  const token = localStorage.getItem("token");

  const load = async()=>{

    const res = await api.get("/candidates/grouped",{
      headers:{Authorization:`Bearer ${token}`}
    });

    setData(res.data);
    
  };

  useEffect(()=>{
    load();
  },[]);

 return(

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">

          🎯 Manage Candidates

        </h1>

        <p className="text-gray-500 text-lg">

          View and manage election candidates across all elections.

        </p>

      </div>

      {/* EMPTY STATE */}

      {data.length===0 && (

        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center text-gray-400 text-xl">

          No candidates available

        </div>

      )}

      {/* ELECTION GROUPS */}

      <div className="space-y-8">

        {data.map((group,index)=>(

          <div

            key={index}

            className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"

          >

            {/* TOP BANNER */}

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <h2 className="text-3xl font-extrabold mb-2">

                    {group.electionTitle}

                  </h2>

                  <p className="text-indigo-100">

                    Candidate Management Panel

                  </p>

                </div>

                {/* STATUS */}

                <div className={`

                  px-6
                  py-3
                  rounded-full
                  font-bold
                  shadow-xl
                  text-white
                  text-center

                  ${

                    group.status==="Active"

                    ? "bg-emerald-500"

                    : group.status==="Upcoming"

                    ? "bg-yellow-500"

                    : "bg-red-500"

                  }

                `}>

                  {group.status}

                </div>

              </div>

            </div>

            {/* CONTENT */}

            <div className="p-8">

              {group.candidates.length===0 ?(

                <div className="bg-slate-100 rounded-2xl p-10 text-center text-gray-400 text-lg">

                  No candidates added

                </div>

              ):(

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {group.candidates.map(c=>(

                    <div

                      key={c._id}

                      className="bg-slate-50 border border-gray-200 rounded-3xl p-6 hover:scale-105 transition-all duration-300 shadow-lg"

                    >

                      {/* AVATAR */}

                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl text-white shadow-xl mb-5">

                        👤

                      </div>

                      {/* NAME */}

                      <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">

                        {c.name}

                      </h3>

                      {/* POSITION */}

                      <div className="text-center">

                        <span className="inline-block bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-semibold">

                          {c.position}

                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </AdminLayout>

  );
}