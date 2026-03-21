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

    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/noticias/todas  →  Todas las noticias (admin/docente)
router.get("/todas", verifyAdmin, async (req, res) => {
  try {
    const noticias = await Noticia.find()
      .populate("autor",    "nombre correo")
      .populate("categoria","nombre")
      .sort({ createdAt: -1 });
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/noticias/:id  →  Obtener una noticia por ID ──────
router.get("/:id", async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id)
      .populate("autor",    "nombre correo rol")
      .populate("categoria","nombre descripcion");

    if (!noticia) return res.status(404).json({ error: "Noticia no encontrada." });

    // Incrementar contador de vistas
    noticia.vistas += 1;
    await noticia.save();

    res.json(noticia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/noticias  →  Crear una noticia ──────────────────
