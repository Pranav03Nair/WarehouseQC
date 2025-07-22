import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend connection successful");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http:localhost:${PORT}`));
