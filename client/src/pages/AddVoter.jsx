import { useState, useEffect, useRef } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../services/api";
import * as XLSX from "xlsx";

export default function AddVoter() {

  /* ---------------- STATES ---------------- */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [electionId, setElectionId] = useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);

  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fileRef = useRef();

  /* ---------------- LOAD ELECTIONS ---------------- */

  const loadElections = async () => {

    try {

      const res = await api.get("/elections", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setElections(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  /* ---------------- LOAD VOTERS ---------------- */

  const loadVoters = async (id = "") => {

    try {

      let url = "/voters";

      if (id) {
        url += `?electionId=${id}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVoters(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {

    loadElections();

  }, []);

  /* ---------------- ADD SINGLE VOTER ---------------- */

  const addVoter = async () => {

    if (!name || !email || !electionId) {

      setMessage("❌ Select election and fill all fields");
      return;

    }

    try {

      setLoading(true);

      await api.post(
        "/voters/add",
        {
          name,
          email,
          electionId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("✅ Voter Added Successfully");

      setName("");
      setEmail("");

      loadVoters(electionId);

    } catch (err) {

      console.log(err);

      setMessage("❌ Failed to add voter");

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- DELETE VOTER ---------------- */

  const deleteVoter = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this voter?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/voters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      loadVoters(electionId);

    } catch (err) {

      console.log(err);

      alert("Failed to delete voter");

    }

  };

  /* ---------------- BULK UPLOAD ---------------- */

  const uploadExcel = async () => {

    if (!file || !electionId) {

      alert("Select election and upload file");
      return;

    }

    try {

      setUploading(true);

      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const json =
        XLSX.utils.sheet_to_json(sheet);

      setTotalCount(json.length);

      let completed = 0;

      for (const row of json) {

        await api.post(
          "/voters/add",
          {
            name: row.name,
            email: row.email,
            electionId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        completed++;

        setUploadCount(completed);

      }

      alert("✅ Bulk Upload Completed");

      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      loadVoters(electionId);

    } catch (err) {

      console.log(err);

      alert("❌ Bulk upload failed");

    } finally {

      setUploading(false);

      setUploadCount(0);
      setTotalCount(0);

    }

  };

  /* ---------------- UI ---------------- */

  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">

          👥 Manage Voters

        </h1>

        <p className="text-gray-500 text-lg">

          Add, upload and manage election voters securely.

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

            loadVoters(id);

          }}

          className="w-full mt-4 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-indigo-300"

        >

          <option value="">

            Select Election

          </option>

          {elections.map((e)=>(

            <option key={e._id} value={e._id}>

              {e.title}

            </option>

          ))}

        </select>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="space-y-8">

          {/* ADD SINGLE */}

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl text-2xl">

                ➕

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">

                  Add Single Voter

                </h2>

                <p className="text-gray-500">

                  Register voters individually

                </p>

              </div>

            </div>

            {message && (

              <div className={`

                mb-5
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

            <input

              placeholder="Voter Name"

              value={name}

              onChange={(e)=>setName(e.target.value)}

              className="w-full border border-gray-200 p-4 rounded-2xl mb-5 outline-none focus:ring-4 focus:ring-indigo-300"

            />

            <input

              placeholder="Email Address"

              value={email}

              onChange={(e)=>setEmail(e.target.value)}

              className="w-full border border-gray-200 p-4 rounded-2xl mb-6 outline-none focus:ring-4 focus:ring-indigo-300"

            />

            <button

              onClick={addVoter}

              disabled={loading}

              className={`

                w-full
                py-4
                rounded-2xl
                text-white
                font-bold
                shadow-xl
                transition-all
                duration-300

                ${

                  loading

                  ? "bg-gray-400 cursor-not-allowed"

                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 active:scale-95"

                }

              `}

            >

              {

                loading

                ? "Adding Voter..."

                : "Add Voter"

              }

            </button>

          </div>

          {/* BULK UPLOAD */}

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl text-2xl">

                📁

              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">

                  Bulk Upload

                </h2>

                <p className="text-gray-500">

                  Upload Excel or CSV files

                </p>

              </div>

            </div>

            {/* DROPZONE */}

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl h-48 cursor-pointer hover:bg-slate-50 transition-all duration-300">

              <div className="text-center">

                <div className="text-5xl mb-4">

                  📤

                </div>

                <p className="font-semibold text-slate-700">

                  Click to Upload File

                </p>

                <p className="text-gray-400 mt-2">

                  Excel / CSV Supported

                </p>

                {file && (

                  <p className="mt-4 text-emerald-600 font-bold">

                    {file.name}

                  </p>

                )}

              </div>

              <input

                ref={fileRef}

                type="file"

                accept=".xlsx,.csv"

                onChange={(e)=>setFile(e.target.files[0])}

                className="hidden"

              />

            </label>

            <button

              onClick={uploadExcel}

              disabled={uploading}

              className={`

                w-full
                mt-6
                py-4
                rounded-2xl
                text-white
                font-bold
                shadow-xl
                transition-all
                duration-300

                ${

                  uploading

                  ? "bg-gray-400 cursor-not-allowed"

                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 active:scale-95"

                }

              `}

            >

              {

                uploading

                ? `Uploading ${uploadCount}/${totalCount}...`

                : "Upload File"

              }

            </button>

            <p className="mt-4 text-sm text-gray-500">

              Required columns:
              <strong> name | email</strong>

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-3xl font-bold text-slate-800">

                Registered Voters

              </h2>

              <p className="text-gray-500">

                Total: {voters.length}

              </p>

            </div>

            <div className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-semibold">

              👥 Active List

            </div>

          </div>

          {/* SEARCH */}

          <input

            placeholder="Search voter..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            className="w-full border border-gray-200 p-4 rounded-2xl mb-6 outline-none focus:ring-4 focus:ring-indigo-300"

          />

          {/* TABLE */}

          <div className="overflow-auto rounded-2xl border border-gray-200">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-4 text-left">

                    Name

                  </th>

                  <th className="p-4 text-left">

                    Email

                  </th>

                  <th className="p-4 text-center">

                    Action

                  </th>

                </tr>

              </thead>

              <tbody>

                {voters.length===0 && (

                  <tr>

                    <td

                      colSpan="3"

                      className="text-center p-10 text-gray-400"

                    >

                      No voters available

                    </td>

                  </tr>

                )}

                {voters

                  .filter((v)=>

                    v.name.toLowerCase().includes(search.toLowerCase())

                    ||

                    v.email.toLowerCase().includes(search.toLowerCase())

                  )

                  .map((v)=>(

                    <tr

                      key={v._id}

                      className="border-t hover:bg-slate-50 transition-all duration-200"

                    >

                      <td className="p-4 font-medium">

                        {v.name}

                      </td>

                      <td className="p-4 text-gray-600">

                        {v.email}

                      </td>

                      <td className="p-4 text-center">

                        <button

                          onClick={()=>deleteVoter(v._id)}

                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"

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

      </div>

    </AdminLayout>

  );

}