import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    navigate("/student/login");
  }, [navigate]);

  return (
    <div className="page active">
      <div className="card">
        <div className="card-body text-center">
           <h3>Logging out...</h3>
        </div>
      </div>
    </div>
  );
};

export default Logout;
