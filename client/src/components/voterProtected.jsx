import { Navigate } from "react-router-dom";

export default function VoterProtected({children}){

  const voter = localStorage.getItem("voterId");

  if(!voter){
    return <Navigate to="/voter-login"/>;
  }

  return children;
}