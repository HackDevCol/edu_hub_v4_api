const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    clave: {
      type: String,
      required: [true, "La clave es obligatoria"],
      minlength: 6,
    },
    rol: {
      type: String,
      enum: ["estudiante", "docente", "admin"],
      default: "estudiante",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
