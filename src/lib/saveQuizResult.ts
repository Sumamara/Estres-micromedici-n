import { supabase } from "./supabaseClient";
import type { PulseScores, SessionNumber } from "@/components/quiz/quizData";

export interface PulseSubmission {
    /** Nombre del participante */
    userName: string;
    /** Número de sesión del taller (1 a 5) */
    session: SessionNumber;
    /** Los 5 indicadores en escala 0..100 (0, 20, 40, 60, 80, 100) */
    scores: PulseScores;
    /** Índice global de control semanal (0–100) con carga_corporal invertida */
    controlIndex: number;
    /** Tiempo activo en segundos */
    timeSpentSeconds?: number;
}

/**
 * Guarda un registro semanal de Medición de control en la tabla `Estres_Pulso` de Supabase.
 *
 * Nunca lanza: si Supabase no está configurado o falla la red, lo registra en
 * consola y devuelve false sin romper el panel de resultados.
 */
export const saveQuizResult = async (submission: PulseSubmission): Promise<boolean> => {
    if (!supabase) {
        console.info("[Estres_Pulso] Supabase sin configurar: se guarda solo en el navegador.");
        return false;
    }

    const { userName, session, scores, controlIndex, timeSpentSeconds } = submission;

    const row = {
        nombre: userName.trim() || "Sin nombre",
        sesion: session,
        desconectar: scores.desconectar,
        organizar: scores.organizar,
        recargar: scores.recargar,
        regular: scores.regular,
        carga_corporal: scores.carga_corporal,
        indice_control: controlIndex,
        tiempo_segundos: timeSpentSeconds ?? null,
    };

    try {
        const { error } = await supabase.from("Estres_Pulso").insert(row);

        if (error) {
            console.error("[Estres_Pulso] No se pudo guardar la medición:", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("[Estres_Pulso] Error inesperado al guardar:", err);
        return false;
    }
};
