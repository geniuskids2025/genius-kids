// Variables globales
let usuario = null;
let moduloActual = '';
let nivelActual = 0;
let ejercicioActual = 0;
let puntos = 0;

// Sonidos
const sonidoCorrecto = new Audio('https://www.soundjay.com/button/beep-07.wav');
const sonidoIncorrecto = new Audio('https://www.soundjay.com/button/beep-10.wav');
const sonidoFondo = new Audio('https://www.fesliyanstudios.com/play-mp3/387'); // Reemplaza por uno tuyo si quieres

// Mostrar pantalla
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.getElementById(id).classList.add('activa');
}

// Crear cuenta
function crearCuenta() {
  const nombre = document.getElementById('nombre-nino').value;
  const fecha = document.getElementById('fecha-nacimiento').value;
  const grado = document.getElementById('grado-escolar').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!nombre || !fecha || !grado || !email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  usuario = { nombre, fecha, grado, email, password, puntos: 0 };
  localStorage.setItem('usuario', JSON.stringify(usuario));
  actualizarPerfil();
  mostrarPantalla('pantalla-modulos');
}

// Iniciar sesión
function iniciarSesion() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const datos = JSON.parse(localStorage.getItem('usuario'));
  if (datos && datos.email === email && datos.password === password) {
    usuario = datos;
    puntos = usuario.puntos || 0;
    actualizarPerfil();
    mostrarPantalla('pantalla-modulos');
  } else {
    alert("Correo o contraseña incorrectos.");
  }
}

// Actualizar perfil
function actualizarPerfil() {
  if (!usuario) return;
  document.getElementById('perfil-nombre').textContent = usuario.nombre;
  document.getElementById('perfil-grado').textContent = usuario.grado;
  document.getElementById('perfil-puntos').textContent = puntos;
}

// Seleccionar módulo
function seleccionarModulo(modulo) {
  moduloActual = modulo;
  mostrarPantalla('pantalla-niveles');
  const contenedor = document.getElementById('niveles-container');
  contenedor.innerHTML = '';

  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement('button');
    btn.textContent = Nivel ${i};
    btn.onclick = () => iniciarNivel(i);
    contenedor.appendChild(btn);
  }
}

// Iniciar nivel
function iniciarNivel(nivel) {
  nivelActual = nivel;
  ejercicioActual = 0;
  mostrarPantalla('pantalla-ejercicio');
  mostrarEjercicio();
}

// Mostrar ejercicio
function mostrarEjercicio() {
  const preguntaElem = document.getElementById('pregunta-ejercicio');
  const opcionesElem = document.getElementById('opciones-ejercicio');
  opcionesElem.innerHTML = '';

  const ejercicio = generarEjercicio(moduloActual, nivelActual);
  preguntaElem.textContent = ejercicio.pregunta;

  ejercicio.opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op;
    btn.onclick = () => verificarRespuesta(op, ejercicio.respuesta);
    opcionesElem.appendChild(btn);
  });
}

// Verificar respuesta
function verificarRespuesta(opcion, respuestaCorrecta) {
  if (opcion === respuestaCorrecta) {
    puntos++;
    sonidoCorrecto.play();
  } else {
    sonidoIncorrecto.play();
  }

  ejercicioActual++;
  if (ejercicioActual < 6) {
    mostrarEjercicio();
  } else {
    usuario.puntos = puntos;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    actualizarPerfil();
    alert("¡Nivel completado! Bien hecho 👏");
    mostrarPantalla('pantalla-modulos');
  }
}

// Generar ejercicio
function generarEjercicio(modulo, nivel) {
  const max = nivel * 10;
  const a = Math.floor(Math.random() * max);
  const b = Math.floor(Math.random() * max);

  let pregunta = '', respuesta = 0;

  switch (modulo) {
    case 'comparacion':
      pregunta = ¿Cuál es mayor: ${a} o ${b}?;
      respuesta = a > b ? a : b;
      break;
    case 'suma':
      pregunta = ¿Cuánto es ${a} + ${b}?;
      respuesta = a + b;
      break;
    case 'resta':
      pregunta = ¿Cuánto es ${a} - ${b}?;
      respuesta = a - b;
      break;
    case 'multiplicacion':
      pregunta = ¿Cuánto es ${a} × ${b}?;
      respuesta = a * b;
      break;
    case 'division':
      const divisor = b === 0 ? 1 : b;
      const dividendo = a * divisor;
      pregunta = ¿Cuánto es ${dividendo} ÷ ${divisor}?;
      respuesta = a;
      break;
  }

  const opciones = generarOpciones(respuesta);
  return { pregunta, opciones, respuesta };
}

// Generar opciones aleatorias
function generarOpciones(correcta) {
  const opciones = new Set();
  opciones.add(correcta);
  while (opciones.size < 4) {
    opciones.add(correcta + Math.floor(Math.random() * 10 - 5));
  }
  return Array.from(opciones).sort(() => Math.random() - 0.5);
}

// Música de fondo
window.onload = () => {
  mostrarPantalla('pantalla-bienvenida');
  sonidoFondo.loop = true;
  sonidoFondo.volume = 0.2;
  sonidoFondo.play().catch(() => {
    console.log("El usuario debe interactuar primero para activar el sonido.");
  });
};