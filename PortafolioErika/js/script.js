const form = document.getElementById("formContacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoMensaje = document.getElementById("mensaje");
const errorNombre = document.getElementById("errorNombre");
const errorEmail = document.getElementById("errorEmail");
const errorMensaje = document.getElementById("errorMensaje");
const contador = document.getElementById("contador");
const avisoExito = document.getElementById("avisoExito");
const infoExtra = document.getElementById("infoExtra");
const btnVerMas = document.getElementById("btnVerMas");
const btnProyectos = document.getElementById("btnProyectos");
const btnSubir = document.getElementById("btnSubir");
const navLinks = document.querySelectorAll(".nav a");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let extraVisible = false;

function mostrarError(span, mensaje) {
  span.textContent = mensaje;
  span.hidden = false;
}

function ocultarError(span) {
  span.hidden = true;
}

function validarNombre() {
  if (campoNombre.value.trim() === "") {
    mostrarError(errorNombre, "El nombre es obligatorio.");
    return false;
  }
  ocultarError(errorNombre);
  return true;
}

function validarEmail() {
  if (!EMAIL_REGEX.test(campoEmail.value.trim())) {
    mostrarError(errorEmail, "Ingrese un email válido.");
    return false;
  }
  ocultarError(errorEmail);
  return true;
}

function validarMensaje() {
  if (campoMensaje.value.trim().length < 10) {
    mostrarError(errorMensaje, "El mensaje debe tener al menos 10 caracteres.");
    return false;
  }
  ocultarError(errorMensaje);
  return true;
}

if (btnVerMas) {
  btnVerMas.addEventListener("click", () => {
    extraVisible = !extraVisible;
    infoExtra.classList.toggle("oculto", !extraVisible);
    btnVerMas.textContent = extraVisible ? "Ver menos" : "Ver más";
  });
}

if (btnProyectos) {
  btnProyectos.addEventListener("click", () => {
    document.getElementById("proyectos").scrollIntoView({ behavior: "smooth" });
  });
}

if (btnSubir) {
  btnSubir.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

campoMensaje.addEventListener("input", () => {
  contador.textContent = campoMensaje.value.length + " caracteres";
  if (campoMensaje.value.trim().length >= 10) {
    ocultarError(errorMensaje);
  }
});

campoNombre.addEventListener("input", () => ocultarError(errorNombre));
campoEmail.addEventListener("input", () => ocultarError(errorEmail));

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  avisoExito.classList.add("oculto");

  const nombreOk = validarNombre();
  const emailOk = validarEmail();
  const mensajeOk = validarMensaje();

  if (nombreOk && emailOk && mensajeOk) {
    avisoExito.classList.remove("oculto");
    form.reset();
    contador.textContent = "0 caracteres";
  }
});

const secciones = document.querySelectorAll(".seccion");
const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "activo",
            link.getAttribute("href") === "#" + entrada.target.id
          );
        });
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px", threshold: 0.2 }
);

secciones.forEach((seccion) => observer.observe(seccion));

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btnSubir.classList.add("mostrar");
  } else {
    btnSubir.classList.remove("mostrar");
  }
});