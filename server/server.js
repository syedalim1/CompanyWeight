const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Example pipe data with weight per inch and price per kg for SS and MS pipes
const pipes = {
  "SS-1mm-Round-1-inch": { weightPerInch: 0.3, pricePerKg: 150 },
  "SS-1.2mm-Round-1-inch": { weightPerInch: 0.35, pricePerKg: 160 },
  "MS-1mm-Round-1-inch": { weightPerInch: 0.2, pricePerKg: 100 },
  "MS-1.2mm-Round-1-inch": { weightPerInch: 0.25, pricePerKg: 110 },

  "SS-1mm-Round-1/2-inch": { weightPerInch: 0.18, pricePerKg: 120 },
  "SS-1.2mm-Round-1/2-inch": { weightPerInch: 0.22, pricePerKg: 125 },
  "MS-1mm-Round-1/2-inch": { weightPerInch: 0.15, pricePerKg: 90 },
  "MS-1.2mm-Round-1/2-inch": { weightPerInch: 0.2, pricePerKg: 95 },

  "SS-1mm-Square-1x1-inch": { weightPerInch: 0.4, pricePerKg: 180 },
  "SS-1.2mm-Square-1x1-inch": { weightPerInch: 0.45, pricePerKg: 190 },
  "MS-1mm-Square-1x1-inch": { weightPerInch: 0.3, pricePerKg: 130 },
  "MS-1.2mm-Square-1x1-inch": { weightPerInch: 0.35, pricePerKg: 140 },

  "SS-1mm-Square-1-1/4x1-1/4-inch": { weightPerInch: 0.5, pricePerKg: 200 },
  "SS-1.2mm-Square-1-1/4x1-1/4-inch": { weightPerInch: 0.55, pricePerKg: 210 },
  "MS-1mm-Square-1-1/4x1-1/4-inch": { weightPerInch: 0.4, pricePerKg: 160 },
  "MS-1.2mm-Square-1-1/4x1-1/4-inch": { weightPerInch: 0.45, pricePerKg: 170 },

  "SS-1mm-Square-1-1/2x1-1/2-inch": { weightPerInch: 0.6, pricePerKg: 220 },
  "SS-1.2mm-Square-1-1/2x1-1/2-inch": { weightPerInch: 0.65, pricePerKg: 230 },
  "MS-1mm-Square-1-1/2x1-1/2-inch": { weightPerInch: 0.5, pricePerKg: 180 },
  "MS-1.2mm-Square-1-1/2x1-1/2-inch": { weightPerInch: 0.55, pricePerKg: 190 },
};

// API to calculate total weight and price for multiple pipes
app.post("/calculate-weight", (req, res) => {
  const { pipesData } = req.body;

  if (!pipesData || pipesData.length === 0) {
    return res.status(400).json({ message: "No pipes data provided" });
  }

  let totalWeight = 0;
  let totalPrice = 0;

  pipesData.forEach((pipe) => {
    const pipeKey = `${pipe.material}-${pipe.thickness}-${pipe.shape}-${pipe.pipeType}`;
    const pipeInfo = pipes[pipeKey];

    if (pipeInfo) {
      const weight = pipeInfo.weightPerInch * pipe.length;
      totalWeight += weight;
      totalPrice += (weight * pipeInfo.pricePerKg) / 1000; // Price per kg calculation
    }
  });

  res.json({
    totalWeight: totalWeight.toFixed(2), // Total weight rounded to 2 decimal places
    totalPrice: totalPrice.toFixed(2), // Total price rounded to 2 decimal places
  });
});

// Start the server
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
