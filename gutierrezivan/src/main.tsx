import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css"; 
import { DevBoundary } from "./DevBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevBoundary>
      <App />
    </DevBoundary>
  </React.StrictMode>
);
