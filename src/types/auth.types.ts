export type RolSesion = {
  id: number;
  nombre: string;
};

export interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string | null;
  rolIds: number[];
  roles: RolSesion[];
  estado: string;
}
