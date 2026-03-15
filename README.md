# 📰 API de Noticias Universitarias

API REST para la gestión de noticias universitarias en un Aula Virtual.  
Desarrollada con **Node.js**, **Express** y **MongoDB Atlas**, protegida con **bcrypt** y **JWT**.

---

## 👥 Integrantes del equipo

| Usuario GitHub | Nombre completo        | Rama            |
|----------------|------------------------|-----------------|
| `HackDevCol`   | Julian Moreno          | JulianMoreno    |
| `Jeiss98`      | Jeisson Palma          | JeissonPalma    |
| `GustavoG352`  | Gustavo Gallego        | GustavoGallego  |

> ⚠️ Cada integrante trabaja en su propia rama. Ver sección de ramas más abajo.

---

## 🛠️ Tecnologías utilizadas

| Tecnología      | Versión | Uso                                      |
|-----------------|---------|------------------------------------------|
| Node.js         | 18+     | Entorno de ejecución                     |
| Express         | 4.x     | Framework para la API REST               |
| MongoDB Atlas   | —       | Base de datos NoSQL en la nube           |
| Mongoose        | 8.x     | ODM para modelado de datos               |
| bcrypt          | 5.x     | Cifrado de contraseñas                   |
| jsonwebtoken    | 9.x     | Autenticación con tokens JWT             |
| dotenv          | 16.x    | Variables de entorno                     |
| cors            | 2.x     | Control de acceso entre orígenes         |
| nodemon         | 3.x     | Reinicio automático en desarrollo        |

---

## 🔐 Seguridad: bcrypt y JWT

### bcrypt
Se usa para **cifrar la contraseña** del usuario antes de guardarla en MongoDB.  
Al registrarse, la clave pasa por `bcrypt.hash()` con un salt de 10 rondas.  
Al iniciar sesión, se compara con `bcrypt.compare()` sin necesidad de descifrar.

```js
// Cifrar
const salt = await bcrypt.genSalt(10);
usuario.clave = await bcrypt.hash(clave, salt);

// Comparar
const esValida = await bcrypt.compare(claveIngresada, usuario.clave);
```

### JWT (JSON Web Token)
Tras el login/registro exitoso, se genera un token con `jwt.sign()`.  
El cliente debe enviar ese token en el header `access-token` en cada petición protegida.  
El middleware `verifyToken` valida el token y extrae el payload `{ id, rol }`.

```js
// Generar
const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.SECRET, { expiresIn: "24h" });

// Verificar (middleware)
const verificado = jwt.verify(token, process.env.SECRET);
req.usuario = verificado;
```

---

## 📁 Estructura del proyecto

```
apinoticias/
├── models/
│   ├── Usuario.js        # Modelo de usuarios con bcrypt
│   ├── Noticia.js        # Modelo de noticias universitarias
│   ├── Categoria.js      # Categorías de noticias
│   └── Comentario.js     # Comentarios en noticias
├── routes/
│   ├── authRoutes.js     # /api/auth  → signup, login, perfil
│   ├── usuarioRoutes.js  # /api/usuarios  → CRUD usuarios
│   ├── noticiaRoutes.js  # /api/noticias  → CRUD noticias
│   ├── categoriaRoutes.js# /api/categorias → CRUD categorías
│   └── comentarioRoutes.js# /api/comentarios → CRUD comentarios
├── middleware/
│   └── verifyToken.js    # Middlewares: verifyToken, verifyAdmin
├── server.js             # Punto de entrada principal
├── .env.example          # Variables de entorno (plantilla)
├── .gitignore
└── package.json
```

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario>/apinoticias.git
cd apinoticias

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MongoDB Atlas y tu SECRET JWT

# 4. Ejecutar en desarrollo
npm run dev

# 5. Ejecutar en producción
npm start
```

---

## 🗂️ Módulos y Endpoints

### 🔑 Autenticación  `/api/auth`

| Método | Ruta             | Descripción                          | Autenticación |
|--------|------------------|--------------------------------------|---------------|
| POST   | `/api/auth/signup` | Registrar nuevo usuario             | Pública       |
| POST   | `/api/auth/login`  | Iniciar sesión → devuelve token JWT | Pública       |
| GET    | `/api/auth/perfil` | Ver perfil del usuario autenticado  | Token JWT     |

### 👤 Usuarios  `/api/usuarios`

| Método | Ruta                  | Descripción             | Autenticación        |
|--------|-----------------------|-------------------------|----------------------|
| GET    | `/api/usuarios`       | Listar todos            | Admin/Docente        |
| GET    | `/api/usuarios/:id`   | Obtener uno por ID      | Token JWT            |
| POST   | `/api/usuarios`       | Crear usuario           | Admin/Docente        |
| PUT    | `/api/usuarios/:id`   | Actualizar usuario      | Token JWT            |
| DELETE | `/api/usuarios/:id`   | Eliminar usuario        | Admin/Docente        |

### 📰 Noticias  `/api/noticias`

| Método | Ruta                    | Descripción                        | Autenticación  |
|--------|-------------------------|------------------------------------|----------------|
| GET    | `/api/noticias`         | Listar noticias publicadas         | Pública        |
| GET    | `/api/noticias/todas`   | Todas las noticias (borradores…)   | Admin/Docente  |
| GET    | `/api/noticias/:id`     | Ver una noticia (suma vista)       | Pública        |
| POST   | `/api/noticias`         | Crear noticia                      | Admin/Docente  |
| PUT    | `/api/noticias/:id`     | Actualizar noticia                 | Admin/Docente  |
| DELETE | `/api/noticias/:id`     | Eliminar noticia                   | Admin/Docente  |

### 🗂️ Categorías  `/api/categorias`

| Método | Ruta                      | Descripción           | Autenticación |
|--------|---------------------------|-----------------------|---------------|
| GET    | `/api/categorias`         | Listar activas        | Pública       |
| GET    | `/api/categorias/:id`     | Obtener una           | Pública       |
| POST   | `/api/categorias`         | Crear categoría       | Admin/Docente |
| PUT    | `/api/categorias/:id`     | Actualizar            | Admin/Docente |
| DELETE | `/api/categorias/:id`     | Eliminar              | Admin/Docente |

### 💬 Comentarios  `/api/comentarios`

| Método | Ruta                                  | Descripción                    | Autenticación |
|--------|---------------------------------------|--------------------------------|---------------|
| GET    | `/api/comentarios/noticia/:noticiaId` | Comentarios de una noticia     | Pública       |
| GET    | `/api/comentarios`                    | Todos los comentarios          | Admin/Docente |
| GET    | `/api/comentarios/:id`                | Obtener uno por ID             | Token JWT     |
| POST   | `/api/comentarios`                    | Crear comentario               | Token JWT     |
| PUT    | `/api/comentarios/:id`                | Editar comentario              | Token JWT     |
| DELETE | `/api/comentarios/:id`                | Eliminar comentario            | Token JWT     |

---

## 📬 Ejemplos de peticiones (Postman/Thunder)

### Registro de usuario
```http
POST /api/auth/signup
Content-Type: application/json

{
  "nombre": "Ana García",
  "correo": "ana@universidad.edu.co",
  "clave": "secreta123",
  "rol": "docente"
}
```

### Inicio de sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "ana@universidad.edu.co",
  "clave": "secreta123"
}
```

### Crear noticia (requiere token)
```http
POST /api/noticias
Content-Type: application/json
access-token: <token_jwt>

{
  "titulo": "Convocatoria becas 2025",
  "contenido": "La universidad abre convocatoria...",
  "resumen": "Becas disponibles para todos los programas",
  "categoria": "<id_categoria>",
  "publicada": true
}
```

### Buscar noticias
```http
GET /api/noticias?buscar=becas
GET /api/noticias?categoria=<id_categoria>
```

---

## 🌿 Ramas Git

Cada integrante trabaja en su propia rama con el formato `NombreApellido`:

```bash
git checkout -b NombreApellido
git add .
git commit -m "feat: descripción del cambio"
git push origin NombreApellido
```

---

## 🤖 Herramientas IA utilizadas

- **Claude (Anthropic)**: Apoyo en la generación de la estructura base del proyecto, modelos de datos y configuración de middlewares. También usado para revisar lógica de autenticación JWT/bcrypt.
- El equipo adaptó, personalizó y probó todo el código generado para ajustarlo al contexto del proyecto.
