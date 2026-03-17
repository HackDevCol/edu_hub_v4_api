const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema(
  {
    contenido: {
      type: String,
      required: [true, "El contenido del comentario es obligatorio"],
      trim: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    noticia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Noticia",
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comentario", comentarioSchema);
