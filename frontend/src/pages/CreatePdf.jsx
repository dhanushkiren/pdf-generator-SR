import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreatePdf.css";

const CreatePdf = () => {
  const [inputData, setInputData] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [dataStatus, setDataStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create-pdf",
        {
          data: inputData,
        },
        { responseType: "blob" }
      );

      if (response.status === 201) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPdfUrl(url);
        toast.success("successfully converted and ready to download");
        setDataStatus("Success");
      }
    } catch (error) {
      console.error("Error:DK axios", error.response.status);
      if (error.response.status === 400) {
        const errorText = await response.error;
        console.log("dkdk eorro", errorText);
        setDataStatus("Error");
      } else if (error.response.status === 409) {
        console.log("Duplicate data provided");
        setDataStatus("Duplicate");
      } else {
        console.error("Error: Unable to create PDF");
      }
    }
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const handleDownload = () => {
    if (dataStatus === "Success") {
      if (pdfUrl) {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "document.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(pdfUrl);
      }
    } else if(dataStatus === "Duplicate") {
      toast.error("duplicate download requested");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="title">PDF Generator</h2>
        <p className="description">
          Enter your content below and convert it to a downloadable PDF.
        </p>
        <form onSubmit={handleSubmit} className="pdf-form">
          <label htmlFor="input-data" className="form-label">
            Enter your Data
          </label>
          <textarea
            id="input-data"
            required
            rows="6"
            placeholder="Type your content here..."
            value={inputData}
            onChange={handleInputChange}
            className="form-textarea"
          ></textarea>
          <button type="submit" className="submit-button">
            Convert to PDF
          </button>
          {pdfUrl && (
            <button onClick={handleDownload} className="download-button">
              Download PDF
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePdf;
