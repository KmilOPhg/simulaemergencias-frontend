import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { PageHeader } from "../../components/consulta/PageHeader";
import { CampoError } from "../../components/consulta/CampoError";
import { TIPOS_ESCENARIO, etiquetaEscenario, type TipoEscenario } from "../../constants/escenarios.constants";
import { EjerciciosService } from "../../services/ejercicios.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand";
const inputErrorClass =
  "mt-1 w-full rounded-xl border border-red-400 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-red-500";

const fechaHoy = (): string => {
  const fecha = new Date();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

type Errores = Partial<Record<"nombre" | "fecha" | "tipoEscenario" | "horaInicio" | "lugar" | "descripcion", string>>;

export const NuevoEjercicioPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(fechaHoy());
  const [tipoEscenario, setTipoEscenario] = useState<TipoEscenario | "">("");
  const [horaInicio, setHoraInicio] = useState("");
  const [lugar, setLugar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  const validar = (): Errores => {
    const siguiente: Errores = {};
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) siguiente.nombre = "Completa este campo";
    else if (nombreLimpio.length < 3 || nombreLimpio.length > 150) {
      siguiente.nombre = "El nombre debe tener entre 3 y 150 caracteres.";
    }
    if (!fecha) siguiente.fecha = "Completa este campo";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) siguiente.fecha = "La fecha debe tener formato AAAA-MM-DD.";
    if (!tipoEscenario) siguiente.tipoEscenario = "Completa este campo";
    const horaNormalizada = horaInicio.slice(0, 5);
    if (horaNormalizada && !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaNormalizada)) {
      siguiente.horaInicio = "La hora de inicio debe tener formato HH:mm.";
    }
    if (lugar.trim().length > 200) siguiente.lugar = "El lugar no puede superar 200 caracteres.";
    if (descripcion.trim().length > 2000) siguiente.descripcion = "La descripción no puede superar 2000 caracteres.";
    return siguiente;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const siguientes = validar();
    setErrores(siguientes);
    if (Object.keys(siguientes).length > 0) return;

    setEnviando(true);
    try {
      const creado = await EjerciciosService.crear({
        nombre: nombre.trim(),
        fecha,
        tipoEscenario: tipoEscenario as TipoEscenario,
        ...(horaInicio ? { horaInicio: horaInicio.slice(0, 5) } : {}),
        ...(lugar.trim() ? { lugar: lugar.trim() } : {}),
        ...(descripcion.trim() ? { descripcion: descripcion.trim() } : {}),
      });
      toast.success("Ejercicio de emergencia registrado correctamente.");
      navigate(`/resultados?ejercicioId=${creado.id}`);
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo registrar el ejercicio."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ConsultaShell>
      <Link to="/ejercicios" className="inline-flex items-center gap-1 text-sm text-brand mb-3 hover:underline">
        <ChevronLeft size={16} aria-hidden />
        Historial de ejercicios
      </Link>
      <PageHeader
        title="Registrar ejercicio"
        description="Identifica la actividad cuyos resultados se van a gestionar. Los escenarios permitidos son sismo, incendio e intruso."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-w-2xl space-y-4"
      >
        <div>
          <label htmlFor="nombre-ejercicio" className="block text-sm font-medium text-slate-700">
            Nombre del ejercicio <span className="text-red-600">*</span>
          </label>
          <input
            id="nombre-ejercicio"
            value={nombre}
            maxLength={150}
            onChange={(e) => {
              const valor = e.target.value;
              setNombre(valor);
              if (!errores.nombre) return;
              const limpio = valor.trim();
              const errorNombre = !limpio
                ? "Completa este campo"
                : limpio.length < 3 || limpio.length > 150
                  ? "El nombre debe tener entre 3 y 150 caracteres."
                  : undefined;
              setErrores((prev) => ({ ...prev, nombre: errorNombre }));
            }}
            placeholder="Escribe el nombre"
            aria-invalid={Boolean(errores.nombre)}
            className={errores.nombre ? inputErrorClass : inputClass}
          />
          {errores.nombre === "Completa este campo" ? (
            <CampoError
              id="error-nombre"
              mensaje="Completa este campo"
              detalle="Escribe el nombre del ejercicio para continuar."
            />
          ) : (
            errores.nombre && <CampoError id="error-nombre" mensaje={errores.nombre} />
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fecha-ejercicio" className="block text-sm font-medium text-slate-700">
              Fecha <span className="text-red-600">*</span>
            </label>
            <input
              id="fecha-ejercicio"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-invalid={Boolean(errores.fecha)}
              className={errores.fecha ? inputErrorClass : inputClass}
            />
            {errores.fecha && <CampoError id="error-fecha" mensaje={errores.fecha} />}
          </div>
          <div>
            <label htmlFor="hora-ejercicio" className="block text-sm font-medium text-slate-700">
              Hora de inicio
            </label>
            <input
              id="hora-ejercicio"
              type="time"
              step={60}
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value.slice(0, 5))}
              aria-invalid={Boolean(errores.horaInicio)}
              className={errores.horaInicio ? inputErrorClass : inputClass}
            />
            {errores.horaInicio && <CampoError id="error-hora" mensaje={errores.horaInicio} />}
          </div>
        </div>

        <div>
          <label htmlFor="escenario-ejercicio" className="block text-sm font-medium text-slate-700">
            Tipo de escenario <span className="text-red-600">*</span>
          </label>
          <select
            id="escenario-ejercicio"
            value={tipoEscenario}
            onChange={(e) => setTipoEscenario(e.target.value as TipoEscenario | "")}
            aria-invalid={Boolean(errores.tipoEscenario)}
            className={errores.tipoEscenario ? inputErrorClass : inputClass}
          >
            <option value="">Selecciona un escenario</option>
            {TIPOS_ESCENARIO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {etiquetaEscenario(tipo)}
              </option>
            ))}
          </select>
          {errores.tipoEscenario && (
            <CampoError id="error-escenario" mensaje="Completa este campo" detalle="Selecciona sismo, incendio o intruso." />
          )}
        </div>

        <div>
          <label htmlFor="lugar-ejercicio" className="block text-sm font-medium text-slate-700">
            Lugar
          </label>
          <input
            id="lugar-ejercicio"
            value={lugar}
            maxLength={200}
            onChange={(e) => setLugar(e.target.value)}
            className={errores.lugar ? inputErrorClass : inputClass}
          />
          {errores.lugar && <CampoError id="error-lugar" mensaje={errores.lugar} />}
        </div>

        <div>
          <label htmlFor="descripcion-ejercicio" className="block text-sm font-medium text-slate-700">
            Descripción
          </label>
          <textarea
            id="descripcion-ejercicio"
            value={descripcion}
            maxLength={2000}
            rows={4}
            onChange={(e) => setDescripcion(e.target.value)}
            className={errores.descripcion ? inputErrorClass : inputClass}
          />
          {errores.descripcion && <CampoError id="error-descripcion" mensaje={errores.descripcion} />}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-slate-400"
          >
            {enviando ? "Guardando…" : "Registrar ejercicio"}
          </button>
          <Link to="/ejercicios" className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Cancelar
          </Link>
        </div>
      </form>
    </ConsultaShell>
  );
};
