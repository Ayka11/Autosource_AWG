import React, { useState, useEffect, useRef } from "react";
import './Dashboard.css'; // Assuming the CSS file is named Dashboard.css
import { useNavigate } from "react-router-dom";
import HeaterTubeSimulation from './HeaterTubeSimulation';
import Chatbot from "./Chatbot"; // Ensure this path is correct based on your project structure
import { clearAuthSession, getAuthSession, isAuthenticated } from "../utils/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    photo: '',
    userName: '',
  });
   const [isMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage chat visibility
  const chatWindowRef = useRef(null); // Create a ref for the chat window
   const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

   const pageStyles = {
    container: {
      display: "flex",
      justifyContent: isMobile ? "center" : "space-between",
      padding: "20px",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    column: {
      width: isMobile ? "100%" : "48%",
      textAlign: "center",
      marginBottom: "20px",
    },
    image: {
      width: "100%",
      height: "auto",
      borderRadius: "8px",
    },
    button: {
      backgroundColor: "#007BFF",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      cursor: "pointer",
    },
    chatIcon: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "60px",
      height: "60px",
      backgroundColor: "#007BFF",
      color: "#fff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    chatWindow: {
      position: "fixed",
      bottom: "80px",
      right: "20px",
      width: "300px",
      height: "500px", // Updated height from 400px to 500px
      border: "1px solid #007BFF",
      borderRadius: "8px",
      backgroundColor: "#fff",
      display: isChatOpen ? "block" : "none",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      overflow: "hidden",
    },
    chatHeader: {
      backgroundColor: "#007BFF",
      color: "#fff",
      padding: "10px",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const session = getAuthSession();

    const mapSessionToUser = (s) => ({
      name: s.name || 'N/A',
      email: s.email || 'N/A',
      photo: s.photo || 'https://via.placeholder.com/120',
      userName: s.userName || '',
    });

    setUser(mapSessionToUser(session));
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="profile">
        <img src={user.photo} alt="Profile" className="profile-photo" />
        <h2 className="profile-name">{user.name}</h2>
        {user.userName && (
          <p className="profile-username" style={{ fontWeight: 600 }}>
            @{user.userName}
          </p>
        )}
        <p className="profile-email">{user.email}</p>
		<HeaterTubeSimulation />
      </div>
      <button className="logout-button" onClick={() => {
        clearAuthSession();
        navigate('/login', { replace: true });
      }}>
        Logout
      </button>
	  
	  {/* Chat Icon */}
      <div style={pageStyles.chatIcon} onClick={toggleChat}>
        💬
      </div>
	  
	  {/* Chat Window with Chatbot */}
      <div style={pageStyles.chatWindow} ref={chatWindowRef}>
        {" "}
        {/* Attach ref here */}
        <div style={pageStyles.chatHeader}>Chat with Us</div>
        <Chatbot /> {/* Integrate Chatbot component */}
      </div>

    </div>
  );
};

export default Dashboard;
