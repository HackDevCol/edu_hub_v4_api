const express    = require("express");
const router     = express.Router();
const Comentario = require("../models/Comentario");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

// ── GET /api/comentarios/noticia/:noticiaId  →  Comentarios de una noticia
router.get("/noticia/:noticiaId", async (req, res) => {
  try {
    const comentarios = await Comentario.find({
      noticia: req.params.noticiaId,
      activo: true,
    })
      .populate("autor", "nombre correo rol")
      .sort({ createdAt: -1 });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
