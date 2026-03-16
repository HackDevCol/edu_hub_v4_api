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
