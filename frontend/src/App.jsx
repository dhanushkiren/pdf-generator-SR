import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CreatePdf from "./pages/CreatePdf";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
      <ToastContainer position="top-center" theme="colored"  />
        <Routes>
          <Route path="/" element={<CreatePdf />} />
          <Route />
        </Routes>
      </Router>
    </>
  );
}

export default App;
