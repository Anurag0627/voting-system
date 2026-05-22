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

      <h1 className="text-3xl font-bold mb-6">
        Manage Voters
      </h1>

      {/* ===== SELECT ELECTION ===== */}

      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <label className="font-semibold">
          Select Election
        </label>

        <select
          value={electionId}
          onChange={(e) => {

            const id = e.target.value;

            setElectionId(id);

            loadVoters(id);

          }}
          className="w-full border p-3 rounded-lg mt-2"
        >

          <option value="">
            Select Election
          </option>

          {elections.map((e) => (

            <option
              key={e._id}
              value={e._id}
            >
              {e.title}
            </option>

          ))}

        </select>

      </div>

      {/* ===== MAIN GRID ===== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ---------- LEFT ---------- */}

        <div className="space-y-6">

          {/* ADD SINGLE VOTER */}

          <div className="bg-white shadow rounded-xl p-6">

            {message && (

              <p
                className={`mb-4 font-medium ${
                  message.includes("✅")
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>

            )}

            <h2 className="font-semibold mb-4">
              Add Single Voter
            </h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border p-3 rounded mb-4"
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border p-3 rounded mb-4"
            />

            <button
              onClick={addVoter}
              disabled={loading}
              className={`w-full text-white p-3 rounded-lg transition-all duration-150
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-800 transform hover:scale-105 active:scale-95 active:bg-indigo-900"
              }`}
            >

              {loading
                ? "Adding Voter..."
                : "Add Voter"}

            </button>

          </div>

          {/* BULK UPLOAD */}

          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="font-semibold mb-4">
              Bulk Upload (Excel / CSV)
            </h2>

            {/* Upload Box */}

            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">

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
                ref={fileRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                className="hidden"
              />

            </label>

            <button
              onClick={uploadExcel}
              disabled={uploading}
              className={`w-full mt-4 text-white p-3 rounded-lg transition-all duration-150
              ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-800 transform hover:scale-105 active:scale-95 active:bg-emerald-900"
              }`}
            >

              {uploading
                ? `Uploading ${uploadCount}/${totalCount}...`
                : "Upload File"}

            </button>

            <p className="text-sm text-gray-500 mt-3">

              Excel columns must be:
              <strong> name | email</strong>

            </p>

          </div>

        </div>

        {/* ---------- RIGHT ---------- */}

        <div className="bg-white shadow rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4">
            Registered Voters
          </h2>

          {/* SEARCH */}

          <input
            placeholder="Search voter..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

                <tr>

                  <td
                    colSpan="3"
                    className="p-4 text-center text-gray-400"
                  >
                    No voters available
                  </td>

                </tr>

              )}

              {voters
                .filter((v) =>

                  v.name
                    .toLowerCase()
                    .includes(search.toLowerCase())

                  ||

                  v.email
                    .toLowerCase()
                    .includes(search.toLowerCase())

                )
                .map((v) => (

                  <tr
                    key={v._id}
                    className="border-b"
                  >

                    <td className="p-2">
                      {v.name}
                    </td>

                    <td className="p-2">
                      {v.email}
                    </td>

                    <td className="p-2">

                      <button
                        onClick={() =>
                          deleteVoter(v._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transform hover:scale-105 active:scale-95 active:bg-red-900 transition-all duration-150"
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