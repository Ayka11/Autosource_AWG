import React, { useState, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import {
  decodeGoogleCredential,
  isRegisteredUser,
  isUsernameTaken,
  registerUser,
  saveUserProfile,
  setAuthSession,
} from "../utils/auth";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("oauth");
  const pendingRef = useRef(null);

  const [message, setMessage] = useState(null);
  const [messageTone, setMessageTone] = useState("error");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatWindowRef = useRef(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const pageStyles = {
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
      height: "500px",
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
    label: {
      display: "block",
      textAlign: "left",
      marginBottom: "6px",
      fontWeight: 600,
      fontSize: "14px",
    },
    input: {
      width: "100%",
      maxWidth: "400px",
      padding: "10px 12px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
    },
    fieldWrap: {
      marginBottom: "16px",
      width: "100%",
      maxWidth: "400px",
      alignSelf: "center",
    },
  };

  const handleSignupSuccess = (credentialResponse) => {
    setMessage(null);
    const idToken = credentialResponse?.credential;
    const payload = decodeGoogleCredential(idToken);

    if (!idToken || !payload?.email) {
      setMessageTone("error");
      setMessage(
        "Google did not return a usable email in the token. Try again, or use another browser (Chrome works best)."
      );
      return;
    }

    pendingRef.current = { idToken, payload };
    setFirstName((payload.given_name || "").trim());
    setLastName((payload.family_name || "").trim());
    setUserName("");
    setStep("profile");
  };

  const handleSignupError = () => {
    setMessageTone("error");
    setMessage(
      "Google sign-in did not complete (popup blocked, cancelled, or browser blocked third-party cookies). Allow pop-ups for this site, try Chrome, or retry."
    );
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    const un = userName.trim();

    if (!fn || !ln) {
      setMessageTone("error");
      setMessage("Please enter your first and last name.");
      return;
    }
    if (!USERNAME_RE.test(un)) {
      setMessageTone("error");
      setMessage(
        "Username must be 3–32 characters: letters, numbers, and underscores only."
      );
      return;
    }

    const pending = pendingRef.current;
    if (!pending?.payload?.email || !pending.idToken) {
      setMessageTone("error");
      setMessage("Session expired. Go back and sign in with Google again.");
      setStep("oauth");
      return;
    }

    const email = pending.payload.email;

    if (isRegisteredUser(email)) {
      setMessageTone("error");
      setMessage("This email is already registered. Use Log in instead.");
      return;
    }

    if (isUsernameTaken(un, email)) {
      setMessageTone("error");
      setMessage("That username is already taken. Choose another.");
      return;
    }

    saveUserProfile(email, { firstName: fn, lastName: ln, userName: un });
    registerUser(email);

    const displayName = [fn, ln].filter(Boolean).join(" ");
    setAuthSession({
      token: pending.idToken,
      name: displayName,
      email,
      photo: pending.payload.picture || "",
      firstName: fn,
      lastName: ln,
      userName: un,
    });

    setMessage(null);
    pendingRef.current = null;
    navigate("/dashboard");
  };

  const noticeStyle =
    messageTone === "error"
      ? { background: "#fde8e8", border: "1px solid #f5c2c7", color: "#842029" }
      : { background: "#e7f1ff", border: "1px solid #b6d4fe", color: "#084298" };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      {message && (
        <div
          role="alert"
          style={{
            ...noticeStyle,
            maxWidth: "720px",
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "15px",
            lineHeight: 1.45,
            textAlign: "left",
          }}
        >
          {message}
        </div>
      )}
      <div
        style={{
          wordBreak: "break-word",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: "300px",
          margin: "50px 0",
          textAlign: "center",
          fontSize: "25px",
        }}
      >
        <h2>Create your account</h2>
        <p>
          {step === "oauth"
            ? "Sign in with Google, then complete your profile."
            : "Tell us your name and choose a username."}
        </p>
      </div>
      <div style={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <img
          src={`${process.env.PUBLIC_URL}/1.JPG`}
          alt="Water Generator"
          style={{ maxWidth: "100%", width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </div>

      {step === "oauth" && (
        <div style={{ width: "100%", maxWidth: "1200px", display: "flex", flexDirection: "column", padding: "20px", textAlign: "center" }}>
          <h2>Sign up</h2>
          <p>Step 1 of 2 — verify with Google</p>
          <div style={{ marginTop: "20px", alignSelf: "center" }}>
            <GoogleLogin
              onSuccess={handleSignupSuccess}
              onError={handleSignupError}
              text="signup_with"
            />
          </div>
          <p style={{ marginTop: "24px", fontSize: "16px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#007BFF" }}>
              Log in
            </Link>
          </p>
        </div>
      )}

      {step === "profile" && (
        <form
          onSubmit={handleProfileSubmit}
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            alignItems: "center",
          }}
        >
          <h2>Your details</h2>
          <p style={{ marginBottom: "20px" }}>Step 2 of 2</p>

          <div style={pageStyles.fieldWrap}>
            <label htmlFor="su-first" style={pageStyles.label}>
              First name
            </label>
            <input
              id="su-first"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
              style={pageStyles.input}
              required
            />
          </div>
          <div style={pageStyles.fieldWrap}>
            <label htmlFor="su-last" style={pageStyles.label}>
              Last name
            </label>
            <input
              id="su-last"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
              style={pageStyles.input}
              required
            />
          </div>
          <div style={pageStyles.fieldWrap}>
            <label htmlFor="su-user" style={pageStyles.label}>
              Username
            </label>
            <input
              id="su-user"
              type="text"
              autoComplete="username"
              value={userName}
              onChange={(ev) => setUserName(ev.target.value)}
              style={pageStyles.input}
              placeholder="e.g. water_ops_alex"
              required
            />
            <small style={{ display: "block", marginTop: "6px", color: "#555" }}>
              3–32 characters: letters, numbers, underscores only.
            </small>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "12px",
              padding: "12px 28px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Complete sign up
          </button>
          <button
            type="button"
            onClick={() => {
              pendingRef.current = null;
              setStep("oauth");
            }}
            style={{
              marginTop: "16px",
              background: "none",
              border: "none",
              color: "#007BFF",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Back to Google sign-in
          </button>
        </form>
      )}

      <div style={pageStyles.chatIcon} onClick={toggleChat} role="presentation">
        💬
      </div>

      <div style={pageStyles.chatWindow} ref={chatWindowRef}>
        <div style={pageStyles.chatHeader}>Chat with Us</div>
        <Chatbot />
      </div>
    </div>
  );
}

export default Signup;
