import React, { useState } from "react";
import axios from "axios";
import "./CreatePdf.css";
import { toast } from "react-toastify";

const CreatePdf = () => {
  const [inputData, setInputData] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

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
      } else if (response.status === 400) {
        const errorText = await response.error;
        console.log("dkdk eorro");

        console.log(errorText);
      } else if (response.status === 409) {
        console.log("Duplicate data provided");
      } else {
        console.error("Error: Unable to create PDF");
      }
    } catch (error) {
      console.error("Error:DK axios", error);
    }
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(pdfUrl);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="pdf-form">
        <label htmlFor="input-data">Input data:</label>
        <textarea
          name="input-data"
          id="input-data"
          required
          rows="4"
          cols="50"
          value={inputData}
          onChange={handleInputChange}
        ></textarea>
        <br />

        <button type="submit" className="submit-button">
          Convert
        </button>
        {pdfUrl && (
          <button onClick={handleDownload} className="download-button">
            Download
          </button>
        )}
      </form>
    </div>
  );
};

export default CreatePdf;
