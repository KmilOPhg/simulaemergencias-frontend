import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Scaffold básico de Capacitor para empaquetar esta SPA como app Android/iOS.
 *
 * Esto NO es una app móvil nativa completa: es la misma app web responsive
 * corriendo dentro de un WebView. Para features nativas reales (cámara, push,
 * almacenamiento offline, etc.) agrega los plugins de Capacitor que necesites.
 *
 * Flujo típico:
 *   1. npm run build          → genera dist/
 *   2. npx cap add android    → crea la carpeta android/ (una sola vez)
 *   3. npx cap add ios        → crea la carpeta ios/ (una sola vez, requiere macOS)
 *   4. npm run cap:sync       → build + copia los assets web a las plataformas nativas
 *   5. npm run cap:android / npm run cap:ios → abre el proyecto nativo en Android Studio / Xcode
 */
const config: CapacitorConfig = {
  appId: "com.simulaemergencias.app",
  appName: "simulaemergencias",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
