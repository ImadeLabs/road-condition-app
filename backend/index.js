import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Neon DB connection
const pool = new Pool({
  connectionString: "YOUR_NEON_DATABASE_URL", // paste from Neon
  ssl: { rejectUnauthorized: false },
});

// Create users table if it doesn’t exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )
`);

// ✅ Get all users
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.json(result.rows);
});

// ✅ Add a user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.json(result.rows[0]);
});

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
