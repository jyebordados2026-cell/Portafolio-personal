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

if (campoMensaje) {
  campoMensaje.addEventListener("input", () => {
    contador.textContent = campoMensaje.value.length + " caracteres";
    if (campoMensaje.value.trim().length >= 10) {
      ocultarError(errorMensaje);
    }
  });
}

if (campoNombre) campoNombre.addEventListener("input", () => ocultarError(errorNombre));
if (campoEmail) campoEmail.addEventListener("input", () => ocultarError(errorEmail));

if (form) {
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    avisoExito.classList.add("oculto");

    const nombreOk = validarNombre();
    const emailOk = validarEmail();
    const mensajeOk = validarMensaje();

    if (nombreOk && emailOk && mensajeOk) {
      avisoExito.classList.remove("oculto");
      form.reset();
      if (contador) contador.textContent = "0 caracteres";
    }
  });
}

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

if (btnSubir) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      btnSubir.classList.add("mostrar");
    } else {
      btnSubir.classList.remove("mostrar");
    }
  });
}

/* ===== CRUD Proyectos (Backend + SQLite + TypeScript) ===== */
const API_PROYECTOS =
  location.protocol === "file:"
    ? "http://localhost:3000/api/proyectos"
    : "/api/proyectos";

const listaProyectos = document.getElementById("listaProyectos");
const formProyecto = document.getElementById("formProyecto");
const tituloGestion = document.getElementById("tituloGestion");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const errorProyecto = document.getElementById("errorProyecto");

const campoProyectoId = document.getElementById("proyectoId");
const pNombre = document.getElementById("pNombre");
const pDescripcion = document.getElementById("pDescripcion");
const pTecnologias = document.getElementById("pTecnologias");
const pImagen = document.getElementById("pImagen");
const pEnlace = document.getElementById("pEnlace");
const pEstado = document.getElementById("pEstado");

const NOMBRES_ESTADO = {
  publicado: "Publicado",
  "en-desarrollo": "En desarrollo",
  borrador: "Borrador",
};

let proyectosCacheados = [];

async function cargarProyectos() {
  if (!listaProyectos) return;
  try {
    const respuesta = await fetch(API_PROYECTOS);
    if (!respuesta.ok) throw new Error("Respuesta no válida");
    const proyectos = await respuesta.json();
    proyectosCacheados = proyectos;
    renderizarProyectos(proyectos);
  } catch (error) {
    listaProyectos.innerHTML = "";
    const p = document.createElement("p");
    p.className = "cargando";
    p.textContent = "No se pudieron cargar los proyectos. Verificá que el backend esté corriendo (npm start en /backend).";
    listaProyectos.appendChild(p);
  }
}

function renderizarProyectos(proyectos) {
  if (!listaProyectos) return;
  listaProyectos.innerHTML = "";

  if (proyectos.length === 0) {
    const p = document.createElement("p");
    p.className = "cargando";
    p.textContent = "Todavía no hay proyectos cargados.";
    listaProyectos.appendChild(p);
    return;
  }

  proyectos.forEach((proyecto, index) => {
    const article = document.createElement("article");
    article.className = "proyecto";

    const num = document.createElement("span");
    num.className = "proyecto-num";
    num.textContent = String(index + 1).padStart(2, "0");
    article.appendChild(num);

    if (proyecto.imagenUrl) {
      const img = document.createElement("img");
      img.className = "proyecto-imagen";
      img.src = proyecto.imagenUrl;
      img.alt = "Imagen del proyecto " + proyecto.nombre;
      article.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = proyecto.nombre;
    article.appendChild(h3);

    const desc = document.createElement("p");
    desc.textContent = proyecto.descripcion;
    article.appendChild(desc);

    const tec = document.createElement("p");
    tec.className = "tecnologias";
    tec.textContent = proyecto.tecnologias.join(" · ");
    article.appendChild(tec);

    const estado = document.createElement("span");
    estado.className = "estado estado-" + proyecto.estado;
    estado.textContent = NOMBRES_ESTADO[proyecto.estado] || proyecto.estado;
    article.appendChild(estado);

    if (proyecto.enlaceUrl) {
      const enlace = document.createElement("a");
      enlace.href = proyecto.enlaceUrl;
      enlace.target = "_blank";
      enlace.rel = "noopener";
      enlace.textContent = "Ver enlace";
      enlace.classList.add("boton");
      enlace.classList.add("boton-mini");
      article.appendChild(enlace);
    }

    const acciones = document.createElement("div");
    acciones.className = "proyecto-acciones";

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "boton boton-mini";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => cargarEnFormulario(proyecto.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "boton boton-mini boton-peligro";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarProyecto(proyecto.id));

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);
    article.appendChild(acciones);

    listaProyectos.appendChild(article);
  });
}

function cargarEnFormulario(id) {
  const proyecto = proyectosCacheados.find((p) => p.id === id);
  if (!proyecto) return;

  campoProyectoId.value = proyecto.id;
  pNombre.value = proyecto.nombre;
  pDescripcion.value = proyecto.descripcion;
  pTecnologias.value = proyecto.tecnologias.join(", ");
  pImagen.value = proyecto.imagenUrl || "";
  pEnlace.value = proyecto.enlaceUrl || "";
  pEstado.value = proyecto.estado;

  tituloGestion.textContent = "Editar proyecto";
  if (btnCancelarEdicion) btnCancelarEdicion.hidden = false;
  if (errorProyecto) errorProyecto.hidden = true;
  formProyecto.scrollIntoView({ behavior: "smooth", block: "center" });
}

function limpiarFormulario() {
  if (!formProyecto) return;
  formProyecto.reset();
  campoProyectoId.value = "";
  tituloGestion.textContent = "Agregar nuevo proyecto";
  if (btnCancelarEdicion) btnCancelarEdicion.hidden = true;
  if (errorProyecto) errorProyecto.hidden = true;
}

async function eliminarProyecto(id) {
  if (!confirm("¿Eliminar este proyecto?")) return;

  try {
    const respuesta = await fetch(API_PROYECTOS + "/" + id, { method: "DELETE" });
    if (!respuesta.ok && respuesta.status !== 204) throw new Error("No se pudo eliminar");
    await cargarProyectos();
  } catch (error) {
    alert("Error al eliminar el proyecto.");
  }
}

if (formProyecto) {
  formProyecto.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const id = campoProyectoId.value;

    const datos = {
      nombre: pNombre.value.trim(),
      descripcion: pDescripcion.value.trim(),
      tecnologias: pTecnologias.value.trim(),
      imagenUrl: pImagen.value.trim(),
      enlaceUrl: pEnlace.value.trim(),
      estado: pEstado.value,
    };

    try {
      const respuesta = await fetch(id ? API_PROYECTOS + "/" + id : API_PROYECTOS, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (errorProyecto) {
          errorProyecto.textContent = (resultado.errores || ["No se pudo guardar el proyecto."]).join(" ");
          errorProyecto.hidden = false;
        }
        return;
      }

      limpiarFormulario();
      await cargarProyectos();
    } catch (error) {
      if (errorProyecto) {
        errorProyecto.textContent = "No se pudo conectar con el servidor.";
        errorProyecto.hidden = false;
      }
    }
  });
}

if (btnCancelarEdicion) {
  btnCancelarEdicion.addEventListener("click", limpiarFormulario);
}

cargarProyectos();