/** Códigos de permiso tal cual se siembran en `backend/src/scripts/seed.ts`. */
export const PERMISOS = {
  RECURSOS_CONSULTAR: "recursos.consultar",
  RECURSOS_CREAR: "recursos.crear",
  RECURSOS_ACTUALIZAR: "recursos.actualizar",
  RECURSOS_DESHABILITAR: "recursos.deshabilitar",

  USUARIOS_CONSULTAR: "usuarios.consultar",
  USUARIOS_CREAR: "usuarios.crear",
  USUARIOS_ACTUALIZAR: "usuarios.actualizar",
  USUARIOS_DESHABILITAR: "usuarios.deshabilitar",

  ROLES_CONSULTAR: "roles.consultar",
  ROLES_CREAR: "roles.crear",
  ROLES_ACTUALIZAR: "roles.actualizar",
  ROLES_INHABILITAR: "roles.inhabilitar",
} as const;
