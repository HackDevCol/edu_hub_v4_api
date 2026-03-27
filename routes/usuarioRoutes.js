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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/usuarios  →  Crear usuario (admin) ──────────────
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { nombre, correo, clave, rol } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ error: "El correo ya existe." });

    const usuario = new Usuario({ nombre, correo, clave, rol });
    usuario.clave = await usuario.encryptClave(clave);
    const guardado = await usuario.save();

    const { clave: _, ...datos } = guardado.toObject();
    res.status(201).json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
