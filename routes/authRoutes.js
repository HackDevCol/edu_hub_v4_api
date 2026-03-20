const express  = require("express");
const router   = express.Router();
const jwt      = require("jsonwebtoken");
const Usuario  = require("../models/Usuario");
const { verifyToken } = require("../middleware/verifyToken");

// ── POST /api/auth/signup  →  Registrar un nuevo usuario ──────
router.post("/signup", async (req, res) => {
  try {
    const { nombre, correo, clave, rol } = req.body;

    // Verificar si el correo ya existe
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    const usuario = new Usuario({ nombre, correo, clave, rol });

    // Cifrar la clave con bcrypt antes de guardar
    usuario.clave = await usuario.encryptClave(clave);
    await usuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente.",
      auth: true,
      token,
      usuario: {
        id:     usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol:    usuario.rol,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
