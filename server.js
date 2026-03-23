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
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// ── Rutas ─────────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/usuarios",   require("./routes/usuarioRoutes"));
app.use("/api/noticias",   require("./routes/noticiaRoutes"));
app.use("/api/categorias", require("./routes/categoriaRoutes"));
app.use("/api/comentarios",require("./routes/comentarioRoutes"));

// ── Ruta base ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    mensaje: "📰 API de Noticias Universitarias - Funcionando 🚀",
