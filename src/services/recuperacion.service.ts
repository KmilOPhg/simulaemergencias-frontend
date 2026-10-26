import api from "./api";
import { extractErrorMessage } from "../utils/extractErrorMessage";

/**
 * Este backend (variante sin Supabase) envía el correo de recuperación él mismo
 * (SMTP + nodemailer), por eso el frontend debe mandar el HTML del correo.
 * Personaliza esta plantilla con el logo/branding de tu proyecto.
 */
const htmlPlantilla = (): string => {
  const nombreApp = "simulaemergencias";
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr>
          <td style="background:#1d4ed8;padding:16px 32px;text-align:center;">
            <div style="font-size:12px;font-weight:700;color:#dbeafe;text-transform:uppercase;letter-spacing:1px;">${nombreApp}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 32px;">
            <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">Recuperación de contraseña</h2>
            <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6;">
              Usuario <strong>{{usuarioNombre}}</strong> ({{usuarioEmail}}) solicitó restablecer su contraseña.
            </p>
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">El enlace es válido hasta {{expiracion}}:</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="{{link}}"
                 style="display:inline-block;background:#1d4ed8;color:#fff;font-weight:700;font-size:14px;
                        padding:14px 32px;border-radius:8px;text-decoration:none;">
                Restablecer contraseña
              </a>
            </div>
            <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;text-align:center;word-break:break-all;">
              <a href="{{link}}" style="color:#1d4ed8;">{{link}}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export const RecuperacionService = {
  solicitar: async (email: string): Promise<string> => {
    try {
      const { data } = await api.post("/recuperacion/solicitar", {
        email,
        subject: `Recuperación de contraseña — ${"simulaemergencias"}`,
        html: htmlPlantilla(),
      });
      return data.msg ?? "Si el correo existe en el sistema, recibirás las instrucciones.";
    } catch (err) {
      throw new Error(extractErrorMessage(err, "Error al enviar el correo de recuperación."));
    }
  },

  restablecer: async (token: string, nuevaContrasena: string): Promise<string> => {
    try {
      const { data } = await api.post("/recuperacion/restablecer", { token, nuevaContrasena });
      return data.msg ?? "Contraseña restablecida correctamente.";
    } catch (err) {
      throw new Error(extractErrorMessage(err, "Error al restablecer la contraseña."));
    }
  },
};
