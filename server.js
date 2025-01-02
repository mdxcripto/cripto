const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Ruta al archivo JSON donde guardamos la información
const contenidoPath = path.join(__dirname, 'contenido.json');

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta public

// Ruta GET para obtener el contenido (nombre, descripción, imagen de la moneda, etc.)
app.get('/contenido', (req, res) => {
  fs.readFile(contenidoPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ error: 'Error al leer el archivo de contenido.' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta POST para actualizar el contenido
app.post('/contenido', (req, res) => {
  const { clave, nuevoContenido } = req.body;

  fs.readFile(contenidoPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ error: 'Error al leer el archivo de contenido.' });
    }

    const contenido = JSON.parse(data);

    // Verifica la clave de acceso
    if (clave !== contenido.claveAcceso) {
      return res.status(403).send({ error: 'Clave de acceso incorrecta.' });
    }

    // Actualiza la información de la moneda, fondo y otros datos
    if (nuevoContenido.moneda) {
      contenido.moneda = nuevoContenido.moneda;
    }
    if (nuevoContenido.ultimaActualizacion) {
      contenido.ultimaActualizacion = nuevoContenido.ultimaActualizacion;
    }
    if (nuevoContenido.fondo) {
      contenido.fondo = nuevoContenido.fondo;
    }

    fs.writeFile(contenidoPath, JSON.stringify(contenido, null, 2), (err) => {
      if (err) {
        return res.status(500).send({ error: 'Error al guardar los cambios.' });
      }

      res.send({ mensaje: 'Contenido actualizado con éxito.' });
    });
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
