const jwt = require("jsonwebtoken");

/**
 * Middleware que verifica si el token JWT enviado en el header
 * "access-token" es válido. Si lo es, adjunta el payload
 * decodificado en req.usuario y llama a next().
 */
const verifyToken = (req, res, next) => {
  const token = req.header("access-token");

  if (!token) {
    return res.status(401).json({
      error: "Acceso denegado. No se proporcionó un token.",
    });
  }
