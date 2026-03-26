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
router.get("/:id", async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada." });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/categorias  →  Crear una categoría (admin/docente)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    const guardada  = await categoria.save();
    res.status(201).json(guardada);
