const express  = require("express");
const router   = express.Router();
const Noticia  = require("../models/Noticia");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

// ── GET /api/noticias  →  Listar noticias publicadas ──────────
// Soporta ?categoria=<id>  y  ?buscar=<texto>
router.get("/", async (req, res) => {
  try {
    const filtro = { publicada: true };

    if (req.query.categoria) filtro.categoria = req.query.categoria;
    if (req.query.buscar) {
      filtro.titulo = { $regex: req.query.buscar, $options: "i" };
    }

    const noticias = await Noticia.find(filtro)
      .populate("autor",    "nombre correo rol")
      .populate("categoria","nombre")
      .sort({ fechaPublicacion: -1 });
