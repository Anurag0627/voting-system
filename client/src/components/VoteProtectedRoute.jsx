import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

export default function VoteProtectedRoute({ children }) {

  const [allowed, setAllowed] = useState(null);

  useEffect(() => {

    const checkAccess = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          setAllowed(false);
          return;
        }

        // 🔐 check if already voted
        const res = await api.get("/votes/check", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.voted) {
          setAllowed(false); // ❌ block
        } else {
          setAllowed(true); // ✅ allow
        }

      } catch (err) {
        setAllowed(false);
      }

    };

    checkAccess();

  }, []);

  if (allowed === null) return <p>Checking access...</p>;

  return allowed ? children : <Navigate to="/thank-you" replace />;
}