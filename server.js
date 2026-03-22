require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ── Middlewares globales ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Conexión a MongoDB ────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
