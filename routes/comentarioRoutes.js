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

// ── GET /api/comentarios  →  Todos los comentarios (admin) ────
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const comentarios = await Comentario.find()
      .populate("autor",   "nombre correo")
      .populate("noticia", "titulo")
      .sort({ createdAt: -1 });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/comentarios/:id  →  Un comentario por ID ─────────
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id)
      .populate("autor",   "nombre correo")
      .populate("noticia", "titulo");
    if (!comentario) return res.status(404).json({ error: "Comentario no encontrado." });
    res.json(comentario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/comentarios  →  Crear un comentario ─────────────
router.post("/", verifyToken, async (req, res) => {
  try {
    const comentario = new Comentario({
      contenido: req.body.contenido,
      noticia:   req.body.noticia,
      autor:     req.usuario.id,   // del token JWT
    });
    const guardado = await comentario.save();
    await guardado.populate("autor",   "nombre correo");
    await guardado.populate("noticia", "titulo");
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PUT /api/comentarios/:id  →  Actualizar comentario ────────
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const actualizado = await Comentario.findByIdAndUpdate(
      req.params.id,
      { contenido: req.body.contenido },
      { new: true, runValidators: true }
    )
      .populate("autor",   "nombre correo")
      .populate("noticia", "titulo");

    if (!actualizado) return res.status(404).json({ error: "Comentario no encontrado." });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE /api/comentarios/:id  →  Eliminar comentario ───────
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const eliminado = await Comentario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Comentario no encontrado." });
    res.json({ mensaje: "Comentario eliminado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
