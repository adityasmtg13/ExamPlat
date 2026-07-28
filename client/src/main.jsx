import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster, toast } from "sonner";

import App from "./App";
import "./index.css";

if (typeof window !== "undefined") {
  window.alert = (message) => {
    toast.error(String(message));
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />

    <Toaster
      position="top-left"
      richColors
      duration={2500}
      expand={true}
    />
  </BrowserRouter>
);