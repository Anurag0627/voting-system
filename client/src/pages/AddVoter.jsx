import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";
import * as XLSX from "xlsx";

export default function AddVoter(){

  /* ---------------- STATES ---------------- */

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [electionId,setElectionId] = useState("");

  const [elections,setElections] = useState([]);
  const [voters,setVoters] = useState([]);

  const [search,setSearch] = useState("");
  const [file,setFile] = useState(null);
  const [message,setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* ---------------- LOAD ELECTIONS ---------------- */

  const loadElections = async()=>{

    const res = await api.get("/elections",{
      headers:{Authorization:`Bearer ${token}`}
    });

    setElections(res.data);
  };

  /* ---------------- LOAD VOTERS ---------------- */

  const loadVoters = async(id="")=>{

    let url="/voters";

    if(id) url += `?electionId=${id}`;

    const res = await api.get(url,{
      headers:{Authorization:`Bearer ${token}`}
    });

    setVoters(res.data);
  };

  /* ---------------- ADD SINGLE VOTER ---------------- */

  const addVoter = async()=>{

    if(!name || !email || !electionId){
      setMessage("Select election & fill all fields");
      return;
    }

    try{

      await api.post(
        "/voters/add",
        {name,email,electionId},
        {headers:{Authorization:`Bearer ${token}`}}
      );

      setMessage("✅ Voter Added");

      setName("");
      setEmail("");

      loadVoters(electionId);

    }catch{
      setMessage("❌ Failed to add voter");
    }
  };

  /* ---------------- DELETE VOTER ---------------- */

  const deleteVoter = async(id)=>{

    await api.delete(`/voters/${id}`,{
      headers:{Authorization:`Bearer ${token}`}
    });

    loadVoters(electionId);
  };

  /* ---------------- BULK UPLOAD ---------------- */

  const uploadExcel = async()=>{

    if(!file || !electionId){
      alert("Select election and upload file");
      return;
    }

    const data = await file.arrayBuffer();

    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json(sheet);

    for(const row of json){

      await api.post(
        "/voters/add",
        {
          name:row.name,
          email:row.email,
          electionId
        },
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      );
    }

    alert("✅ Bulk Upload Completed");

    setFile(null);
    loadVoters(electionId);
  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(()=>{
    loadElections();
    loadVoters();
  },[]);

  /* ---------------- UI ---------------- */

  return(
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-6">
        Manage Voters
      </h1>

      {/* ===== SELECT ELECTION ===== */}

      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <label className="font-semibold">Select Election</label>

        <select
          value={electionId}
          onChange={(e)=>{
            const id=e.target.value;
            setElectionId(id);
            loadVoters(id);
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

      {/* ===== MAIN GRID ===== */}

      <div className="grid grid-cols-2 gap-8">

        {/* ---------- LEFT SIDE ---------- */}

        <div className="space-y-6">

          {/* ADD SINGLE VOTER */}
          <div className="bg-white shadow rounded-xl p-6">

            {message && (
              <p className="text-red-600 mb-4">{message}</p>
            )}

            <h2 className="font-semibold mb-4">
              Add Single Voter
            </h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />

            <button
              onClick={addVoter}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg
                          hover:bg-indigo-800
                          transform hover:scale-105 active:scale-95
                          active:bg-indigo-900
                          transition-all duration-150"
            >
              Add Voter
            </button>

          </div>

          {/* BULK UPLOAD */}
          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="font-semibold mb-4">
              Bulk Upload (Excel / CSV)
            </h2>

            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">

                <div className="text-center">

                <p className="text-gray-600 font-medium">
                    📁 Click to choose Excel / CSV file
                </p>

                <p className="text-sm text-gray-400">
                    or drag and drop here
                </p>

                {file && (
                    <p className="mt-2 text-emerald-600 font-semibold">
                    Selected: {file.name}
                    </p>
                )}

                </div>

                <input
                type="file"
                accept=".xlsx,.csv"
                onChange={(e)=>setFile(e.target.files[0])}
                className="hidden"
                />

            </label>

            <button
              onClick={uploadExcel}
              className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-800 transform hover:scale-105 active:scale-95
                          active:bg-emerald-900
                          transition-all duration-150"
            >
              Upload File
            </button>

            <p className="text-sm text-gray-500 mt-3">
              Excel columns must be:
              <strong> name | email</strong>
            </p>

          </div>

        </div>

        {/* ---------- RIGHT SIDE ---------- */}

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4">
            Registered Voters
          </h2>

          {/* SEARCH */}
          <input
            placeholder="Search voter..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />

          <table className="w-full text-left">

            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>

              {voters.length === 0 && (
                <p className="text-gray-400">No voters available</p>
              )}

              {voters
                .filter(v =>
                  v.name.toLowerCase().includes(search.toLowerCase()) ||
                  v.email.toLowerCase().includes(search.toLowerCase())
                )
                .map(v=>(
                  <tr key={v._id} className="border-b">

                    <td className="p-2">{v.name}</td>
                    <td className="p-2">{v.email}</td>

                    <td className="p-2">
                      <button
                        onClick={()=>deleteVoter(v._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transform hover:scale-105 active:scale-95
                          active:bg-red-900
                          transition-all duration-150"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}