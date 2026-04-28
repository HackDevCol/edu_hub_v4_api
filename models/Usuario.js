const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Este campo es obligatorio"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "Este campo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    clave: {
      type: String,
      required: [true, "Este campo es obligatorio"],
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
  { timestamps: true }
);

// ── Método para cifrar la contraseña con bcrypt ───────────────
usuarioSchema.methods.encryptClave = async function (clave) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(clave, salt);
};

// ── Método para comparar contraseñas ─────────────────────────
usuarioSchema.methods.validarClave = async function (claveIngresada) {
  return bcrypt.compare(claveIngresada, this.clave);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
