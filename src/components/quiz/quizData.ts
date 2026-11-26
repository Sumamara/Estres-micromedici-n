/* ═══════════════════════════════════════════════════════════════════════════
   LÓGICA E HISTORIAL DE "MEDICIÓN DE CONTROL" (5 INDICADORES · 5 SESIONES)
   ═══════════════════════════════════════════════════════════════════════════ */

import {
    ESCALA_PULSO,
    INDICADORES,
    SESIONES,
    getSessionMeta,
    type IndicatorDef,
    type IndicatorId,
    type ScaleOption,
    type SessionMeta,
    type SessionNumber,
} from "@/content/pulso";

export {
    ESCALA_PULSO as SCALE_OPTIONS,
    INDICADORES,
    SESIONES,
    getSessionMeta,
};
export type { IndicatorDef, IndicatorId, ScaleOption, SessionMeta, SessionNumber };

export type PulseScores = Record<IndicatorId, number>;

export interface PulseSessionRecord {
    session: SessionNumber;
    scores: PulseScores;
    controlIndex: number;
    completedAt: string;
    timeSpentSeconds: number;
}

export interface PulseHistory {
    userName: string;
    sessions: Partial<Record<SessionNumber, PulseSessionRecord>>;
    updatedAt: string;
}

export interface IndicatorSummary {
    def: IndicatorDef;
    score: number;
    previousScore: number | null;
    previousSession: SessionNumber | null;
    delta: number | null;
    /** true = mejoró respecto a la meta; false = empeoró; null = sin cambio o sin sesión previa */
    improved: boolean | null;
}

export interface ControlBand {
    key: "alerta" | "ajuste" | "progreso" | "solido";
    label: string;
    summary: string;
    badgeClass: string;
}

const HISTORY_STORAGE_KEY = "medicion-control-historial-v1";

/** Convierte el arreglo de 5 respuestas ordenadas en el objeto tipado de indicadores */
export const answersToScores = (answers: number[]): PulseScores => {
    const safe = (idx: number) => {
        const val = answers[idx];
        return typeof val === "number" && !Number.isNaN(val) ? val : 0;
    };
    return {
        desconectar: safe(0),
        organizar: safe(1),
        recargar: safe(2),
        regular: safe(3),
        carga_corporal: safe(4),
    };
};

/**
 * Índice global de control semanal (0–100%).
 * Carga Corporal es inversa: mientras más baja sea la tensión física, mayor control refleja.
 */
export const computeControlIndex = (scores: PulseScores): number => {
    const positiveSum =
        scores.desconectar +
        scores.organizar +
        scores.recargar +
        scores.regular +
        (100 - scores.carga_corporal);
    return Math.round(positiveSum / 5);
};

export const getControlBand = (controlIndex: number): ControlBand => {
    if (controlIndex >= 80) {
        return {
            key: "solido",
            label: "Control sólido",
            summary: "Buen equilibrio entre hábitos de protección y baja tensión física.",
            badgeClass:
                "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
        };
    }
    if (controlIndex >= 60) {
        return {
            key: "progreso",
            label: "En progreso",
            summary: "Tus hábitos ya están sosteniendo la semana con margen para afinar.",
            badgeClass:
                "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25",
        };
    }
    if (controlIndex >= 40) {
        return {
            key: "ajuste",
            label: "En ajuste",
            summary: "Hay señales de avance, pero todavía queda tensión acumulada por soltar.",
            badgeClass:
                "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
        };
    }
    return {
        key: "alerta",
        label: "Carga elevada",
        summary: "Semana exigente: un excelente punto de partida para medir tu cambio con las herramientas.",
        badgeClass:
            "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
    };
};

/** Busca la sesión registrada inmediatamente anterior a la sesión actual */
export const findPreviousSessionRecord = (
    history: PulseHistory | null,
    currentSession: SessionNumber
): PulseSessionRecord | null => {
    if (!history) return null;
    for (let s = currentSession - 1; s >= 1; s--) {
        const rec = history.sessions[s as SessionNumber];
        if (rec) return rec;
    }
    return null;
};

/** Construye el resumen de los 5 indicadores con delta respecto a la sesión anterior */
export const buildIndicatorSummaries = (
    scores: PulseScores,
    previousRecord: PulseSessionRecord | null
): IndicatorSummary[] => {
    return INDICADORES.map((def) => {
        const score = scores[def.id];
        const previousScore = previousRecord ? previousRecord.scores[def.id] : null;
        const delta = previousScore !== null ? score - previousScore : null;

        let improved: boolean | null = null;
        if (delta !== null && delta !== 0) {
            improved = def.goal === "up" ? delta > 0 : delta < 0;
        }

        return {
            def,
            score,
            previousScore,
            previousSession: previousRecord ? previousRecord.session : null,
            delta,
            improved,
        };
    });
};

/** Sugiere la siguiente sesión pendiente según el historial guardado */
export const suggestNextSession = (history: PulseHistory | null): SessionNumber => {
    if (!history) return 1;
    const nums: SessionNumber[] = [1, 2, 3, 4, 5];
    const firstMissing = nums.find((n) => !history.sessions[n]);
    return firstMissing ?? 5;
};

/** Clave de fecha local YYYY-MM-DD para comparar días calendario */
const toLocalDateKey = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;

/**
 * Determina automáticamente la sesión según la fecha en que se realiza:
 * - Sin registros previos → Sesión 1.
 * - Si la última sesión registrada fue hoy → mantiene esa misma sesión.
 * - Si fue en una fecha anterior → avanza automáticamente a la siguiente sesión (hasta 5).
 */
export const resolveSessionByDate = (
    history: PulseHistory | null,
    now: Date = new Date()
): SessionNumber => {
    if (!history) return 1;
    const completed = (Object.keys(history.sessions).map(Number) as SessionNumber[]).sort(
        (a, b) => b - a
    );
    const latestNum = completed[0];
    if (!latestNum) return 1;

    const latestRecord = history.sessions[latestNum];
    if (!latestRecord?.completedAt) return suggestNextSession(history);

    const lastDateKey = toLocalDateKey(new Date(latestRecord.completedAt));
    const todayKey = toLocalDateKey(now);

    if (lastDateKey === todayKey) {
        return latestNum;
    }

    return Math.min(5, latestNum + 1) as SessionNumber;
};

/** Formatea la fecha de una sesión en formato corto legible (ej. "25 nov") */
export const formatSessionDate = (isoDate?: string): string => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("es-CR", {
        day: "numeric",
        month: "short",
    }).format(d);
};

/* ── Persistencia del historial en localStorage ────────────────────────────── */

export const readPulseHistory = (): PulseHistory | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PulseHistory;
        if (!parsed || typeof parsed.sessions !== "object") return null;
        return parsed;
    } catch {
        return null;
    }
};

export const upsertPulseSession = (
    userName: string,
    record: PulseSessionRecord
): PulseHistory => {
    const existing = readPulseHistory();
    const updated: PulseHistory = {
        userName: userName.trim() || existing?.userName || "",
        sessions: {
            ...(existing?.sessions ?? {}),
            [record.session]: record,
        },
        updatedAt: new Date().toISOString(),
    };
    try {
        window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // Modo privado o almacenamiento lleno: devolvemos igual el objeto en memoria
    }
    return updated;
};

export const clearPulseHistory = (): void => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
        // Sin acceso a localStorage
    }
};
