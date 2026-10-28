// TypeScript: modelo y validacion de los proyectos del portfolio.
// Esta es la parte acotada del proyecto donde se aplica tipado estatico.

export type EstadoProyecto = "publicado" | "en-desarrollo" | "borrador";

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  imagenUrl: string | null;
  enlaceUrl: string | null;
  estado: EstadoProyecto;
}

// Datos que llegan del formulario (sin id, que lo asigna la base de datos).
export type ProyectoEntrada = Omit<Proyecto, "id">;

export const ESTADOS: EstadoProyecto[] = [
  "publicado",
  "en-desarrollo",
  "borrador",
];

export function esEstadoValido(valor: unknown): valor is EstadoProyecto {
  return typeof valor === "string" && (ESTADOS as string[]).includes(valor);
}

// Devuelve la lista de errores encontrados (vacia si todo esta bien).
export function validarProyecto(datos: Partial<ProyectoEntrada>): string[] {
  const errores: string[] = [];

  if (!datos.nombre || datos.nombre.trim().length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }

  if (!datos.descripcion || datos.descripcion.trim().length < 10) {
    errores.push("La descripcion debe tener al menos 10 caracteres.");
  }

  if (!Array.isArray(datos.tecnologias) || datos.tecnologias.length === 0) {
    errores.push("Debe indicar al menos una tecnologia.");
  }

  if (!esEstadoValido(datos.estado)) {
    errores.push("El estado debe ser publicado, en-desarrollo o borrador.");
  }

  return errores;
}
