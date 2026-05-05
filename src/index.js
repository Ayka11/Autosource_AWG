import React from "react";
import ReactDOM from "react-dom/client";  // Update import
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { getGoogleClientId } from "./utils/runtimeConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={getGoogleClientId()}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
