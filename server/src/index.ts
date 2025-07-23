import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Route Imports
import shipmentRoutes from "./routes/shipment";
import qcRoutes from "./routes/qc";

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend connection successful");
});
app.use("/shipments", shipmentRoutes);
app.use("/qc", qcRoutes);

// Server FIRE up
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http:localhost:${PORT}`));
