import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';

// Se definen las variables de configuracion
const __filename = fileURLToPath(import.meta.url); // Ruta completa al archivo actual 
const __dirname = dirname(__filename); // Directorio del archivo actual
const app = express(); // Creamos nuestra instancia de aplicación Express.js 
const puerto = 3000; // El puerto donde correrá el servidor
const users = ['Juan', 'Jocelyn', 'Astrid', 'Maria', 'Ignacia','Javier', 'Brian']; // Array de usuarios

// Ruta comodín para manejar solicitudes a rutas no definidas, la coloco arriba para evaluar desde el principio si la ruta existe (daba error colocandola al final)
app.get('*', (req, res) => {
    res.send('Esta página no existe...'); // Sino existe muestra este mensaje
});

// Middleware para acceder al contenido, en este caso guardados en la carpeta publica
app.use(express.static('public')); 

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Para cargar las imágenes para el index.html
app.get('/:imagen', (req, res) => {
    const nombreImagen = req.params.imagen; // Nombre de la imagen que se necesita
    const rutaImagen = path.join(__dirname, 'public/assets/', nombreImagen); // acá se construye la ruta de la imagen
    res.sendFile(rutaImagen); 
});

// Ruta para mostrar la lista de usuarios
app.get('/abracadabra/usuarios', (req, res) => {
    res.send(users); // Enviamos la lista de usuarios
});

// Middleware para validar si un usuario existe o no  y mostrar la imagen "who" sino existe
app.use('/abracadabra/usuarios/:users', (req, res, next) => {
    const usuario = req.params.users;
    users.includes(usuario) ? next() : res.sendFile(path.join(__dirname, '/public/assets/who.jpeg')); // Si el usuario existe, con next avanzamos a la siguiente función
});

// Se crea la ruta para mostrar que el usuario existe
app.get('/abracadabra/usuarios/:users', (req, res) => {
    const usuario = req.params.users;
    res.send(`El usuario "${usuario}" existe`); 

})

// Ruta para mostrar si hay match con el numero ingresado y el random
app.get('/abracadabra/conejo/:n', (req, res) => {
    const numeroAleatorio = Math.floor(Math.random() * 4) + 1; // Numeró aleatorio entre 1 y 4
    const numeroRuta = parseInt(req.params.n);  // Se saca el número del usuario
    // Se usa un ternario para evaluar si el numero es igual o no
    numeroAleatorio == numeroRuta ? res.sendFile(path.join(__dirname, '/public/assets/conejito.jpg')) : res.sendFile(path.join(__dirname, '/public/assets/voldemort.jpg'))
});

// Levantar el servidor con el número de puerto definido más arriba en las constante "puerto"
app.listen(puerto, () => console.log('Server arriba en puerto 3000'));
