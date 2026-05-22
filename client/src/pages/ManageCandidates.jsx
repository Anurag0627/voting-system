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

      <h1 className="text-3xl font-bold mb-8">
        Manage Candidates
      </h1>

      <div className="space-y-6">

        {data.length === 0 && (
          <p className="text-gray-400">No candidates available</p>
        )}

        {data.map((group,index)=>(
          <div
            key={index}
            className="bg-white shadow rounded-xl p-6"
          >

            {/* Election Header */}
            <div className="flex justify-between mb-4">

              <h2 className="text-xl font-bold">
                {group.electionTitle}
              </h2>

              <span className={`px-3 py-1 rounded text-white
                ${
                  group.status==="Active"
                  ? "bg-emerald-500"
                  : group.status==="Upcoming"
                  ? "bg-yellow-500"
                  : "bg-red-500"
                }`}>
                {group.status}
              </span>

            </div>

            {/* Candidate List */}

            {group.candidates.length===0 ?(
              <p className="text-gray-400">
                No candidates added
              </p>
            ):(
              group.candidates.map(c=>(
                <div
                  key={c._id}
                  className="border-b py-3 flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      {c.position}
                    </p>
                  </div>
                </div>
              ))
            )}

          </div>
        ))}

      </div>

    </AdminLayout>
  );
}