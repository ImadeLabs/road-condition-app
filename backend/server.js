import express from "express";
import cors from "cors";
import pkg from "pg";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer + Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "road_reports",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const parser = multer({ storage });

// Routes

// Get all reports
app.get("/api/reports", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reports ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Post a report
app.post("/api/reports", parser.single("photo"), async (req, res) => {
  try {
    const { state, lga, street, description } = req.body;
    const photo = req.file ? req.file.path : null;

    const result = await pool.query(
      "INSERT INTO reports (state, lga, street, description, photo, date) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *",
      [state, lga, street, description, photo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create report" });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚧 Road Condition Reporting API running at http://localhost:${PORT}`));
