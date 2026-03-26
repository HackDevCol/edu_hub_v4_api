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

  try {
    const verificado = jwt.verify(token, process.env.SECRET);
    req.usuario = verificado;   // { id, rol, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado." });
  }
};

/**
 * Middleware que, además de verificar el token,
 * comprueba que el rol del usuario sea "admin" o "docente".
 * Usar en rutas que solo pueden gestionar publicadores.
 */
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.usuario.rol === "admin" || req.usuario.rol === "docente") {
      next();
    } else {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción.",
      });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
