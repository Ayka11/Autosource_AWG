import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import "./chatbot.css"; 
import bot from "../icon/bot.svg";
import user1 from "../icon/user1.svg";
import publish from "../icon/publish.svg";
import faqIcon from "../icon/faq.png"; // Import your FAQ icon
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDrl5fJzaZgq2ENNl0yo9Y0IGFdxLj7Cxk",
  authDomain: "sc-1-433715.firebaseapp.com",
  projectId: "sc-1-433715",
  storageBucket: "sc-1-433715.appspot.com",
  messagingSenderId: "779410445796",
  appId: "1:779410445796:web:3334f5798eaddcf763e3f1",
  measurementId: "G-XYQ0V9Q864"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FAQ_QUESTIONS = [
  "What is an AWG?",
  "Can the AWG be used in all climates?",
  "What kind of water quality does the AWG produce?",
  "What are the initial costs and ongoing expenses for using an AWG?",
  "What are the requirements for installing the AWG?",
  "Can the AWG be installed outdoors?",
  "How do I set up the AWG for optimal performance?",
  "How long does it take for the AWG to produce water?",
  "Are there any energy-saving tips for using the AWG?",
  "What safety measures should be taken to ensure the water from the AWG is safe to drink?",
  "How often should the AWG's water quality be tested?",
  "How do I use the website to find information about the AWG?",
  "Where can I access the user manual on the website?",
  "How can I track my AWG's warranty status through the website?",
  "What should I do if the machine doesn’t produce enough water?",
  
  
];

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState(() => {
    const savedHistory = sessionStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [chatOpened, setChatOpened] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const chatHistoryRef = useRef(null);

  const makeRequest = async (questions) => {
    try {
      const response = await fetch(
        "https://python-app-779410445796.us-central1.run.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_VERTEX_API_KEY}`, // Add your API key
          },
          body: JSON.stringify({ input: questions }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching the response:", error);
      throw error;
    }
  };

 const handleSubmit = async (e) => {
  if (e) {
    e.preventDefault();
  }

  const questions = input
    .split(/[\n,]+/)
    .map((q) => q.trim())
    .filter(Boolean);

  const newHistory = [];
  setLoading(true);
  setTyping(true);

  // Check for emails in the input
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const foundEmails = input.match(emailRegex) || []; // Extract all email addresses

  // Save all found emails to Firestore
  if (foundEmails.length > 0) {
    const emailData = { emails: foundEmails };
    console.log("Extracted email(s):", JSON.stringify(emailData)); // Dump email as JSON

    // Save the emails to Firestore
    try {
      await addDoc(collection(db, "emails"), {
        emails: foundEmails, // Save all found emails
        timestamp: new Date(),
      });
      console.log("Emails saved successfully:", foundEmails);

      // Send thank you message for the emails
      newHistory.push({
        question: input,
        response: "Thanks for sending your email! Feel free to ask any questions about AWG.",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving email:", error);
      newHistory.push({
        question: input,
        response: "There was an error saving your email. Please try again.",
        timestamp: new Date().toISOString(),
      });
    }

    // Update chat history and exit early
    const updatedHistory = [...history, ...newHistory];
    setHistory(updatedHistory);
    sessionStorage.setItem("chatHistory", JSON.stringify(updatedHistory));

    // Clear the input field after sending
    setInput("");
    setLoading(false);
    setTyping(false);
    return; // Exit early
  }

  // Process questions if no email is found
  questions.forEach((question) => {
    newHistory.push({
      question,
      response: "",
      timestamp: new Date().toISOString(),
    });
  });

  const updatedHistory = [...history, ...newHistory];
  setHistory(updatedHistory);
  sessionStorage.setItem("chatHistory", JSON.stringify(updatedHistory));

  try {
    const res = await makeRequest(questions);

    setTimeout(() => {
      questions.forEach((question, index) => {
        const botResponse = res.response[index];
        newHistory[index] = {
          question,
          response: botResponse || "I couldn't find an answer to that.",
          timestamp: new Date().toISOString(),
        };
      });

      const finalUpdatedHistory = [...history, ...newHistory];
      setHistory(finalUpdatedHistory);
      sessionStorage.setItem("chatHistory", JSON.stringify(finalUpdatedHistory));

      // Clear the input field after sending
      setInput(""); // Clear input

      setLoading(false);
      setTyping(false);
    }, 5000);
  } catch (error) {
    console.error("Error fetching the response:", error);
    newHistory.forEach((question) => {
      question.response = "Sorry, there was an error processing your request.";
    });
    const finalUpdatedHistory = [...history, ...newHistory];
    setHistory(finalUpdatedHistory);
    sessionStorage.setItem("chatHistory", JSON.stringify(finalUpdatedHistory));
    setLoading(false);
    setTyping(false);
  }
};



  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (
      !chatOpened &&
      !history.find((item) => item.response === "Welcome to the AWG Chatbot! You can type anything about AWG or click on the FAQ icon to select a question. Please Feel free to leave your contact details (Email address).")
    ) {
      const welcomeMessage = {
        question: "",
        response: "Welcome to the AWG Chatbot! You can type anything about AWG or click on the FAQ icon to select a question. Please Feel Free to leave your Email address for future reference",
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [welcomeMessage, ...history];
      setHistory(updatedHistory);
      sessionStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      setChatOpened(true);
    }
  }, [chatOpened, history]);

  const handleFAQClick = (question) => {
    // Set the input value to the clicked FAQ question
    setInput(question);
    setShowFAQ(false); // Optionally hide FAQ after selection
  };

  return (
    <div className="chatbot-container">
      <div className="faq-icon" onClick={() => setShowFAQ(!showFAQ)}>
        <img src={faqIcon} alt="FAQ" />
      </div>
      {showFAQ && (
        <div className="faq-list">
          {FAQ_QUESTIONS.map((question, index) => (
            <div key={index} className="faq-item" onClick={() => handleFAQClick(question)}>
              {question}
            </div>
          ))}
        </div>
      )}
      <div className="chatbot-history" ref={chatHistoryRef}>
        {history.map((item, index) => (
          <div key={index} className="chatbot-history-item">
            {item.question && (
              <div className="chatbot-user-message">
                <img src={user1} alt="" className="icon" />
                <p className="you">{item.question}</p>
                {item.timestamp && (
                  <span className="chatbot-timestamp">
                    {new Date(item.timestamp).getTime() > Date.now() - 60000
                      ? "Just now"
                      : formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </span>
                )}
              </div>
            )}
            {item.response && (
              <div className="chatbot-bot-message">
                <img src={bot} alt="" className="icon" />
                <p className="pin">{item.response}</p>
                {item.timestamp && (
                  <span className="chatbot-timestamp">
                    {new Date(item.timestamp).getTime() > Date.now() - 60000
                      ? "Just now"
                      : formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="chatbot-bot-message typing">
            <img src={bot} alt="" className="icon" />
            <p className="pin">
              <span className="typing-dots">...</span>
            </p>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="chatbot-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about AWG or anything else..."
          required
          className="chatbot-input"
          onKeyPress={handleKeyPress}
        />
        <img
          src={publish}
          alt="send"
          className="send-icon"
          onClick={input.trim() ? handleSubmit : null}
          style={{
            opacity: input.trim() ? 1 : 0.5,
            cursor: input.trim() ? "pointer" : "not-allowed",
          }}
        />
      </form>
    </div>
  );
};

export default Chatbot;
