import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateElection from "./pages/CreateElection";
import AddCandidate from "./pages/AddCandidate";
import AddVoter from "./pages/AddVoter";
import VoterLogin from "./voter/VoterLogin";
import OTPVerify from "./voter/OTPVerify";
import VotingPage from "./voter/VotingPage";
import ThankYou from "./voter/ThankYou";
import Results from "./pages/Results";
import ProtectedRoute from "./components/ProtectedRoute";
import VoterProtected from "./components/voterProtected";
import ManageElections from "./pages/ManageElections";
import ManageCandidates from "./pages/ManageCandidates";
import VoteProtectedRoute from "./components/VoteProtectedRoute";




export default function App(){

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
        <Route path="/create-election" element={<ProtectedRoute><CreateElection/></ProtectedRoute>}/>
        <Route path="/add-candidate" element={<ProtectedRoute><AddCandidate/></ProtectedRoute>}/>
        <Route path="/add-voter" element={<ProtectedRoute><AddVoter/></ProtectedRoute>}/>
        <Route path="/voter-login" element={<VoterLogin/>}/>
        <Route path="/verify-otp" element={<VoterProtected><OTPVerify/></VoterProtected>}/>
        <Route path="/vote" element={<VotingPage/>}/>
        <Route path="/thank-you" element={<ThankYou/>}/>
        <Route path="/results" element={<ProtectedRoute><Results/></ProtectedRoute>}/>
        <Route path="/manage-elections" element={<ManageElections/>}/>
        <Route path="/manage-candidates" element={<ManageCandidates/>}/>
      </Routes>
    </BrowserRouter>
  );
}
