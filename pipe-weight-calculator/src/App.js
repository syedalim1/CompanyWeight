import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./App.css";

function App() {
  const [pipes, setPipes] = useState([
    { material: "", thickness: "", shape: "", pipeType: "", length: "" },
  ]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // Total Price
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [error, setError] = useState("");

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  // Real-time weight and price update
  useEffect(() => {
    const validPipes = pipes.filter(
      (pipe) =>
        pipe.material &&
        pipe.thickness &&
        pipe.shape &&
        pipe.pipeType &&
        pipe.length
    );
    if (validPipes.length === 0) {
      setTotalWeight(0);
      setTotalPrice(0);
      setError("");
      return;
    }

    const calculateWeightAndPrice = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/calculate-weight",
          { pipesData: validPipes }
        );
        setTotalWeight(response.data.totalWeight);
        setTotalPrice(response.data.totalPrice);
        setError("");
      } catch (error) {
        setError("Error calculating weight and price");
        setTotalWeight(0);
        setTotalPrice(0);
      }
    };

    calculateWeightAndPrice();
  }, [pipes]);

  const handleInputChange = (index, event) => {
    const values = [...pipes];
    values[index][event.target.name] = event.target.value;
    setPipes(values);
  };

  const handleAddPipe = () => {
    setPipes([
      ...pipes,
      { material: "", thickness: "", shape: "", pipeType: "", length: "" },
    ]);
  };

  const handleRemovePipe = (index) => {
    const values = [...pipes];
    values.splice(index, 1);
    setPipes(values);
  };

  const handleClear = () => {
    setPipes([
      { material: "", thickness: "", shape: "", pipeType: "", length: "" },
    ]);
    setTotalWeight(0);
    setTotalPrice(0);
    setError("");
  };

  // Download form as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Total Weight: ${totalWeight} kg`, 10, 10);
    doc.text(`Estimated Price: ₹${totalPrice}`, 10, 20);
    doc.save("pipe-selection.pdf");
  };

  return (
    <div className="container">
      <h1>🔧 Multi-Pipe Weight Calculator</h1>
      <button onClick={toggleDarkMode} className="button">
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <form className="form">
        {pipes.map((pipe, index) => (
          <div
            key={index}
            className={`pipe-group ${pipe.material ? "show" : ""}`}
          >
            {/* Step 1: Select Material */}
            <div className="form-group">
              <label>Material (SS/MS):</label>
              <select
                name="material"
                value={pipe.material}
                onChange={(event) => handleInputChange(index, event)}
                className="input"
              >
                <option value="">Select Material</option>
                <option value="SS">Stainless Steel (SS)</option>
                <option value="MS">Mild Steel (MS)</option>
              </select>
            </div>

            {/* Step 2: Select Thickness */}
            {pipe.material && (
              <div className="form-group">
                <label>Thickness (1mm/1.2mm/other):</label>
                <select
                  name="thickness"
                  value={pipe.thickness}
                  onChange={(event) => handleInputChange(index, event)}
                  className="input"
                >
                  <option value="">Select Thickness</option>
                  <option value="1mm">1 mm</option>
                  <option value="1.2mm">1.2 mm</option>
                  {/* You can add more thicknesses here based on your data */}
                </select>
              </div>
            )}

            {/* Step 3: Select Shape */}
            {pipe.thickness && (
              <div className="form-group">
                <label>Shape (Round/Square):</label>
                <select
                  name="shape"
                  value={pipe.shape}
                  onChange={(event) => handleInputChange(index, event)}
                  className="input"
                >
                  <option value="">Select Shape</option>
                  <option value="Round">Round</option>
                  <option value="Square">Square</option>
                </select>
              </div>
            )}

            {/* Step 4: Select Pipe Size */}
            {pipe.shape && (
              <div className="form-group">
                <label>Pipe Size:</label>
                <select
                  name="pipeType"
                  value={pipe.pipeType}
                  onChange={(event) => handleInputChange(index, event)}
                  className="input"
                >
                  <option value="">Select Pipe Size</option>
                  {/* Add sizes based on the MS and SS data */}
                  {pipe.shape === "Round" ? (
                    <>
                      <option value="20*20">20*20</option>
                      <option value="40*20">40*20</option>
                      <option value="50*50">50*50</option>
                      {/* Add more based on your data */}
                    </>
                  ) : (
                    <>
                      <option value="25*25">25*25</option>
                      <option value="30*30">30*30</option>
                      <option value="100*50">100*50</option>
                      {/* Add more based on your data */}
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Step 5: Enter Length */}
            {pipe.pipeType && (
              <div className="form-group">
                <label>Length (in meters):</label>
                <input
                  name="length"
                  type="number"
                  className={`input ${!pipe.length ? "input-error" : ""}`}
                  value={pipe.length}
                  onChange={(event) => handleInputChange(index, event)}
                  placeholder="Enter length in meters"
                />
              </div>
            )}

            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemovePipe(index)}
            >
              ❌ Remove
            </button>
          </div>
        ))}

        <button type="button" className="button" onClick={handleAddPipe}>
          ➕ Add Another Pipe
        </button>
        <button
          type="button"
          className="button clear-btn"
          onClick={handleClear}
        >
          Clear All
        </button>
      </form>

      <div className="result">
        <h2>Total Weight: {totalWeight} kg</h2>
        <h2>Estimated Price: ₹{totalPrice}</h2>
        <button className="button" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default App;
