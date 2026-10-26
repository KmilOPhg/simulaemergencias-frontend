# simulaemergencias-frontend

Frontend generado con **create-app-fullstack**: React 19 + Vite + TypeScript + Tailwind CSS v4.

## Requisitos

- Node.js 18+
- El backend de este mismo proyecto corriendo (ver `../backend/README.md`)

## Configuración

```bash
npm install
cp .env.example .env   # si no se creó automáticamente
```

Edita `.env`:

```
VITE_API_URL=http://localhost:1206/api
```

## Desarrollo

```bash
npm run dev       # http://localhost:5173
```

## Build de producción

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente para probarlo
```

## Estructura

```
src/
├── App.tsx                 # Rutas + layout protegido por permisos
├── components/
│   ├── layout/              Sidebar, Header, Footer
│   ├── ProtectedRoute.tsx   Guard de rutas por permiso/rol
│   └── CambiarContrasenaModal.tsx
├── config/menuItems.tsx     Ítems del sidebar (filtrados por permiso)
├── constants/                Códigos de permisos y rol admin
├── hooks/useAuth.ts          Sesión, permisos y roles del usuario actual
├── pages/
│   ├── Login.tsx
│   ├── RecuperarContrasena.tsx / RestablecerContrasena.tsx
│   ├── Home.tsx
│   └── recursos/              Módulo de ejemplo (CRUD) — cópialo para tus módulos
├── services/                 Llamadas a la API (axios)
├── types/                    Tipos compartidos (usuario, recurso)
└── utils/
    ├── sesion.storage.ts      Persistencia de sesión en localStorage
    └── extractErrorMessage.ts Normaliza errores de la API para mostrarlos
```

## Autenticación

El token se guarda en `localStorage` (`token`, y `refreshToken`/`usuario`/`permisos`/`roles`
según la variante) y se envía como `Authorization: Bearer <token>` en cada
request (ver `src/services/api.ts`). La validez de la sesión siempre la
confirma el backend (`GET /auth/me/permisos`); el frontend no decodifica el
JWT, así que funciona igual sin importar si el token lo emite este backend
o Supabase Auth.

## Módulo de ejemplo: Recursos

`src/pages/recursos/` implementa un CRUD completo (listar con paginación,
crear, editar, activar/desactivar) contra `/api/recursos` del backend.
Úsalo como plantilla: duplica la carpeta, cambia los campos del formulario,
el tipo en `types/`, el servicio en `services/`, y agrega la ruta + ítem de
menú correspondientes.

## Empaquetado móvil (Capacitor)

Este scaffold incluye una configuración básica de Capacitor para correr la
misma app web dentro de un WebView nativo (Android/iOS). No es una app
móvil nativa completa: para funcionalidades nativas (cámara, push,
almacenamiento offline, etc.) instala y configura los plugins de Capacitor
que necesites.

```bash
npm run build
npx cap add android      # una sola vez
npx cap add ios          # una sola vez (requiere macOS)

npm run cap:sync         # build + copia assets a las plataformas nativas
npm run cap:android      # abre el proyecto en Android Studio
npm run cap:ios          # abre el proyecto en Xcode
```
