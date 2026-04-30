import React, { useState, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import {
  buildSessionFromGoogleLogin,
  decodeGoogleCredential,
  isRegisteredUser,
  setAuthSession,
} from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  
  const [isMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatWindowRef = useRef(null);

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

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    const payload = decodeGoogleCredential(idToken);

    if (!idToken || !payload?.email) {
      alert("Login failed. Missing account information.");
      return;
    }

    if (!isRegisteredUser(payload.email)) {
      alert("No account for this email. Please sign up first.");
      return;
    }

    const session = buildSessionFromGoogleLogin(idToken, payload);
    if (!session) {
      alert("Login failed. Could not load profile.");
      return;
    }
    setAuthSession(session);
    navigate("/dashboard");
  };

  const handleGoogleLoginError = () => {
    alert("Failed to login with Google. Please try again.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ wordBreak: 'break-word', flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: '300px', margin: '50px 0', textAlign: 'center', fontSize: '25px' }}>
        <h2>Get Started</h2>
        <p>Start your journey with our innovative water generator system. Experience the power of automation and sustainability.</p>
      </div>
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <img src={`${process.env.PUBLIC_URL}/1.JPG`} alt="Water Generator" style={{ maxWidth: '100%', width: '100%', height: 'auto', borderRadius: '8px' }} />
      </div>
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
        <h2>Log in</h2>
        <p>For returning users. New here? Create an account first (sign up).</p>
        <div style={{ marginTop: "20px", alignSelf: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            text="signin_with"
          />
        </div>
        <p style={{ marginTop: "24px", fontSize: "16px" }}>
          New user?{" "}
          <Link to="/signup" style={{ color: "#007BFF" }}>
            Sign up with Google
          </Link>
        </p>
      </div>
	  
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
}

export default Login;
