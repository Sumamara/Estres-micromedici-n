/* ═══════════════════════════════════════════════════════════════════════════
   CONTENIDO DE "MEDICIÓN DE CONTROL" (Micro-Pulso Semanal · SIMs / EMA)
   Fuente única de verdad para textos, escala, 5 indicadores y 5 sesiones.
   ═══════════════════════════════════════════════════════════════════════════ */

export type IndicatorId =
    | "desconectar"
    | "organizar"
    | "recargar"
    | "regular"
    | "carga_corporal";

export type SessionNumber = 1 | 2 | 3 | 4 | 5;

export interface ScaleOption {
    value: number;
    label: string;
    pct: string;
}

export interface IndicatorDef {
    id: IndicatorId;
    number: number;
    name: string;
    shortName: string;
    question: string;
    goal: "up" | "down";
    goalLabel: string;
    /** Sesión a partir de la cual se espera ver el salto por efecto escalonado */
    laggedSession: SessionNumber;
    colorHex: string;
    bgSoftClass: string;
    textClass: string;
    borderClass: string;
    barClass: string;
}

export interface SessionMeta {
    num: SessionNumber;
    shortLabel: string;
    label: string;
    phaseTitle: string;
    expectedFocus: string;
    laggedNote: string;
    focusIndicators: IndicatorId[];
}

export const PULSE_META = {
    title: "Medición de control",
    subtitle: "Micro-pulso semanal de 5 indicadores sobre tus últimos 7 días.",
    durationLabel: "1 minuto",
    countLabel: "5 indicadores",
    scaleLabel: "0% a 100%",
    timeWindowPrompt: "Durante los últimos 7 días…",
    brandName: "Inner Base",
} as const;

export const ESCALA_PULSO: ScaleOption[] = [
    { value: 0, label: "Nunca", pct: "0%" },
    { value: 20, label: "Casi nunca", pct: "20%" },
    { value: 40, label: "Algunas veces", pct: "40%" },
    { value: 60, label: "Varias veces", pct: "60%" },
    { value: 80, label: "Casi siempre", pct: "80%" },
    { value: 100, label: "Siempre", pct: "100%" },
];

export const INDICADORES: IndicatorDef[] = [
    {
        id: "desconectar",
        number: 1,
        name: "Desconectar",
        shortName: "Desconectar",
        question:
            "¿En qué porcentaje de los días lograste desconectar tu mente del trabajo al terminar tu jornada?",
        goal: "up",
        goalLabel: "Meta: ↑ Subir",
        laggedSession: 2,
        colorHex: "#0d9488",
        bgSoftClass: "bg-teal-50 dark:bg-teal-950/30",
        textClass: "text-teal-700 dark:text-teal-300",
        borderClass: "border-teal-200 dark:border-teal-800/60",
        barClass: "bg-teal-600",
    },
    {
        id: "organizar",
        number: 2,
        name: "Organizar",
        shortName: "Organizar",
        question:
            "¿En qué porcentaje del tiempo sentiste que tenías el control de tus prioridades y pendientes sin abrumarte?",
        goal: "up",
        goalLabel: "Meta: ↑ Subir",
        laggedSession: 3,
        colorHex: "#2563eb",
        bgSoftClass: "bg-blue-50 dark:bg-blue-950/30",
        textClass: "text-blue-700 dark:text-blue-300",
        borderClass: "border-blue-200 dark:border-blue-800/60",
        barClass: "bg-blue-600",
    },
    {
        id: "recargar",
        number: 3,
        name: "Recargar",
        shortName: "Recargar",
        question:
            "¿En qué porcentaje de los días sentiste que tu descanso te recargó y terminaste el día con buena energía vital?",
        goal: "up",
        goalLabel: "Meta: ↑ Subir",
        laggedSession: 4,
        colorHex: "#16a34a",
        bgSoftClass: "bg-emerald-50 dark:bg-emerald-950/30",
        textClass: "text-emerald-700 dark:text-emerald-300",
        borderClass: "border-emerald-200 dark:border-emerald-800/60",
        barClass: "bg-emerald-600",
    },
    {
        id: "regular",
        number: 4,
        name: "Regular (Emocional)",
        shortName: "Regular",
        question:
            "¿Con qué frecuencia pudiste manejar los picos de presión laboral manteniendo la calma sin irritarte ni desbordarte?",
        goal: "up",
        goalLabel: "Meta: ↑ Subir",
        laggedSession: 5,
        colorHex: "#7c3aed",
        bgSoftClass: "bg-violet-50 dark:bg-violet-950/30",
        textClass: "text-violet-700 dark:text-violet-300",
        borderClass: "border-violet-200 dark:border-violet-800/60",
        barClass: "bg-violet-600",
    },
    {
        id: "carga_corporal",
        number: 5,
        name: "Carga Corporal (Inverso)",
        shortName: "Carga Corporal",
        question:
            "¿Con qué frecuencia sentiste tensión física acumulada (cuello, espalda, estómago o dolor de cabeza) por el trabajo?",
        goal: "down",
        goalLabel: "Meta: ↓ Bajar",
        laggedSession: 5,
        colorHex: "#e11d48",
        bgSoftClass: "bg-rose-50 dark:bg-rose-950/30",
        textClass: "text-rose-700 dark:text-rose-300",
        borderClass: "border-rose-200 dark:border-rose-800/60",
        barClass: "bg-rose-600",
    },
];

export const SESIONES: SessionMeta[] = [
    {
        num: 1,
        shortLabel: "S1",
        label: "Sesión 1",
        phaseTitle: "Línea base inicial",
        expectedFocus: "Foto real de tu punto de partida",
        laggedNote:
            "Esta primera medición establece tu línea base. A partir de la Sesión 2 vas a empezar a ver el efecto escalonado: primero despegará tu curva de Desconectar.",
        focusIndicators: ["desconectar"],
    },
    {
        num: 2,
        shortLabel: "S2",
        label: "Sesión 2",
        phaseTitle: "Efecto de Desconexión",
        expectedFocus: "Sube tu curva de Desconectar",
        laggedNote:
            "Efecto escalonado esperado: después de la Sesión 1 suele subir primero tu indicador de Desconectar. Lo que entrenemos hoy moverá tu curva de Organizar la próxima semana.",
        focusIndicators: ["desconectar"],
    },
    {
        num: 3,
        shortLabel: "S3",
        label: "Sesión 3",
        phaseTitle: "Efecto de Organización",
        expectedFocus: "Sube tu curva de Organizar",
        laggedNote:
            "Efecto escalonado esperado: después de la Sesión 2 suele consolidarse Desconectar y subir Organizar. Lo que practiqués esta semana impulsará tu curva de Recargar.",
        focusIndicators: ["organizar"],
    },
    {
        num: 4,
        shortLabel: "S4",
        label: "Sesión 4",
        phaseTitle: "Efecto de Energía y Recarga",
        expectedFocus: "Sube tu curva de Recargar",
        laggedNote:
            "Efecto escalonado esperado: después de la Sesión 3 empieza a subir tu Energía (Recargar). Lo que entrenemos hoy prepara el salto en Regulación y el alivio de Carga Corporal.",
        focusIndicators: ["recargar"],
    },
    {
        num: 5,
        shortLabel: "S5",
        label: "Sesión 5",
        phaseTitle: "Regulación y Alivio Corporal",
        expectedFocus: "Sube Regular y cae Carga Corporal",
        laggedNote:
            "Efecto escalonado esperado: después de la Sesión 4 sube tu Regulación de picos mientras cae tu Carga Corporal, completando tu curva evolutiva de 5 semanas.",
        focusIndicators: ["regular", "carga_corporal"],
    },
];

export const getSessionMeta = (session: SessionNumber): SessionMeta =>
    SESIONES.find((s) => s.num === session) ?? SESIONES[0];
