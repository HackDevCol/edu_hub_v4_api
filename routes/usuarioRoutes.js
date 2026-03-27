const express  = require("express");
const router   = express.Router();
const Usuario  = require("../models/Usuario");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

// ── GET /api/usuarios  →  Listar todos los usuarios (admin) ───
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-clave");
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/usuarios/:id  →  Obtener un usuario por ID ───────
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-clave");
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
    res.json(usuario);
