const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio"],
    },
    resumen: {
      type: String,
      trim: true,
      default: "",
    },
    imagen: {
      type: String,       // URL de la imagen
      default: "",
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El autor es obligatorio"],
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "La categoría es obligatoria"],
    },
    publicada: {
      type: Boolean,
