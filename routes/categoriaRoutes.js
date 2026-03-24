const express   = require("express");
const router    = express.Router();
const Categoria = require("../models/Categoria");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

// ── GET /api/categorias  →  Listar todas las categorías ───────
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find({ activa: true });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/categorias/:id  →  Obtener una categoría ─────────
