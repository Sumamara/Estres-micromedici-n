"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveQuizResult } from "@/lib/saveQuizResult";
import { cn } from "@/lib/utils";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    CheckCircle2,
    Cloud,
    CloudOff,
    LineChart,
    Minus,
    Plus,
    Sparkles,
    Trash2,
} from "lucide-react";
import {
    SESIONES,
    buildIndicatorSummaries,
    findPreviousSessionRecord,
    formatSessionDate,
    getControlBand,
    getSessionMeta,
    suggestNextSession,
    type PulseHistory,
    type PulseSessionRecord,
    type SessionNumber,
} from "./quizData";
import EvolutionChart from "./result/EvolutionChart";

interface QuizResultMainProps {
    userName: string;
    record: PulseSessionRecord;
    history: PulseHistory | null;
    persistToCloud: boolean;
    initialView?: "indicators" | "curve";
    onNewSession: (nextSession?: SessionNumber) => void;
    onClearHistory: () => void;
}

const LAGGED_STEPS = [
    { session: 2 as SessionNumber, from: "Post S1", label: "↑ Desconectar" },
    { session: 3 as SessionNumber, from: "Post S2", label: "↑ Organizar" },
    { session: 4 as SessionNumber, from: "Post S3", label: "↑ Recargar" },
    { session: 5 as SessionNumber, from: "Post S4", label: "↑ Regular · ↓ Tensión" },
];

const QuizResultMain = ({
    userName,
    record,
    history,
    persistToCloud,
    initialView = "indicators",
    onNewSession,
    onClearHistory,
}: QuizResultMainProps) => {
    const [view, setView] = useState<"indicators" | "curve">(initialView);
    const [viewedSession, setViewedSession] = useState<SessionNumber>(record.session);
    const [cloudStatus, setCloudStatus] = useState<"idle" | "saving" | "saved" | "local">(
        persistToCloud ? "saving" : "local"
    );
    const [confirmReset, setConfirmReset] = useState(false);

    const savedOnceRef = useRef(false);

    useEffect(() => {
        setViewedSession(record.session);
    }, [record.session]);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [view]);

    // Guarda en Supabase (Estres_Pulso) una sola vez al completar el pulso
    useEffect(() => {
        if (!persistToCloud || savedOnceRef.current) return;
        savedOnceRef.current = true;
        setCloudStatus("saving");

        saveQuizResult({
            userName,
            session: record.session,
            scores: record.scores,
            controlIndex: record.controlIndex,
            timeSpentSeconds: record.timeSpentSeconds,
        }).then((ok) => {
            setCloudStatus(ok ? "saved" : "local");
        });
    }, [persistToCloud, userName, record]);

    const displayedRecord = history?.sessions[viewedSession] ?? record;
    const sessionMeta = getSessionMeta(displayedRecord.session);
    const sessionDate = formatSessionDate(displayedRecord.completedAt);
    const previousRecord = findPreviousSessionRecord(history, displayedRecord.session);
    const summaries = buildIndicatorSummaries(displayedRecord.scores, previousRecord);
    const band = getControlBand(displayedRecord.controlIndex);

    const controlDelta = previousRecord
        ? displayedRecord.controlIndex - previousRecord.controlIndex
        : null;

    const completedSessions = SESIONES.filter((s) => Boolean(history?.sessions[s.num]));
    const nextSuggestedSession = suggestNextSession(history);
    const allFiveCompleted = completedSessions.length === 5;

    /* ── VISTA 1: SOLO LOS 5 INDICADORES + BOTÓN "IR A CURVA" ── */
    if (view === "indicators") {
        return (
            <div className="w-full max-w-3xl space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
                <section className="rounded-2xl border bg-card p-5 sm:p-7 shadow-sm space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                    {sessionMeta.label}
                                    {sessionDate ? ` · ${sessionDate}` : ""}
                                </span>
                                {cloudStatus === "saved" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                        <Cloud className="h-3 w-3" aria-hidden="true" />
                                        Guardado
                                    </span>
                                )}
                                {cloudStatus === "local" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                        <CloudOff className="h-3 w-3" aria-hidden="true" />
                                        Guardado local
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                                {userName ? `Tus 5 indicadores, ${userName}` : "Tus 5 indicadores"}
                            </h1>
                        </div>

                        {previousRecord && (
                            <span className="text-xs font-medium text-muted-foreground self-end">
                                Comparado con Sesión {previousRecord.session}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-3">
                        {summaries.map((item) => {
                            const { def, score, delta, improved, previousSession } = item;
                            const isInverse = def.goal === "down";

                            return (
                                <div
                                    key={def.id}
                                    className="rounded-xl border border-border/75 bg-background/60 p-4 space-y-2.5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                                style={{ backgroundColor: def.colorHex }}
                                                aria-hidden="true"
                                            />
                                            <span className="font-bold text-sm sm:text-base text-foreground">
                                                {def.name}
                                            </span>
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                                    isInverse
                                                        ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                                )}
                                            >
                                                {isInverse ? (
                                                    <ArrowDown className="h-3 w-3" aria-hidden="true" />
                                                ) : (
                                                    <ArrowUp className="h-3 w-3" aria-hidden="true" />
                                                )}
                                                {isInverse ? "Bajar" : "Subir"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {delta !== null && previousSession !== null && (
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
                                                        improved === true
                                                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                                            : improved === false
                                                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                                              : "bg-muted text-muted-foreground"
                                                    )}
                                                    title={`Cambio respecto a Sesión ${previousSession}`}
                                                >
                                                    {delta === 0 ? (
                                                        <>
                                                            <Minus className="h-3 w-3" aria-hidden="true" />
                                                            0%
                                                        </>
                                                    ) : (
                                                        <>
                                                            {delta > 0 ? `+${delta}%` : `${delta}%`} vs S
                                                            {previousSession}
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                            <span className="text-lg sm:text-xl font-bold tabular-nums text-foreground min-w-[3.2rem] text-right">
                                                {score}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${Math.max(score, 2)}%`,
                                                backgroundColor: def.colorHex,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botón principal: Ir a curva */}
                    <div className="pt-2">
                        <Button
                            type="button"
                            size="lg"
                            onClick={() => setView("curve")}
                            className="w-full h-13 sm:h-14 text-base sm:text-lg font-bold rounded-xl"
                        >
                            <LineChart className="mr-2 h-5 w-5" aria-hidden="true" />
                            Ir a curva
                            <ArrowRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
                        </Button>
                    </div>
                </section>
            </div>
        );
    }

    /* ── VISTA 2: AVANCE Y CURVA EVOLUTIVA DE 5 SEMANAS ── */
    return (
        <div className="w-full max-w-3xl space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
            {/* ── 1. RESUMEN DEL AVANCE + ÍNDICE GLOBAL ── */}
            <section className="rounded-2xl border bg-card p-5 sm:p-7 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                {sessionMeta.label} de 5
                                {sessionDate ? ` · ${sessionDate}` : ""}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                                {sessionMeta.phaseTitle}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                            {userName ? `Avance de ${userName}` : "Tu avance semanal"}
                        </h1>
                        <p className="text-sm text-muted-foreground">{band.summary}</p>
                    </div>

                    {/* Score global */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 rounded-xl border border-border/70 bg-background/70 px-4 py-3 sm:min-w-[165px]">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Índice de control
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-bold tabular-nums text-foreground">
                                {displayedRecord.controlIndex}%
                            </span>
                            {controlDelta !== null && (
                                <span
                                    className={cn(
                                        "inline-flex items-center text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-md",
                                        controlDelta > 0
                                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                            : controlDelta < 0
                                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                              : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {controlDelta > 0 ? `+${controlDelta}%` : `${controlDelta}%`}
                                </span>
                            )}
                        </div>
                        <span
                            className={cn(
                                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                                band.badgeClass
                            )}
                        >
                            {band.label}
                        </span>
                    </div>
                </div>

                {/* Selector rápido de sesiones registradas (si tiene más de 1) */}
                {completedSessions.length > 1 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                        <span className="text-xs font-semibold text-muted-foreground mr-1">
                            Sesiones registradas:
                        </span>
                        {completedSessions.map((s) => {
                            const sDate = formatSessionDate(history?.sessions[s.num]?.completedAt);
                            return (
                                <button
                                    key={s.num}
                                    type="button"
                                    onClick={() => setViewedSession(s.num)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-colors",
                                        viewedSession === s.num
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary/70 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {s.label}
                                    {sDate ? ` (${sDate})` : ""}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ── 2. GRÁFICA EVOLUTIVA DE 5 SEMANAS ── */}
            <section className="rounded-2xl border bg-card p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-foreground">
                            Curva evolutiva · 5 semanas
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Evolución semana a semana de tus 5 indicadores (0% a 100%).
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                        {completedSessions.length}/5 sesiones registradas
                    </span>
                </div>

                <EvolutionChart history={history} activeSession={displayedRecord.session} />
            </section>

            {/* ── 3. EFECTO ESCALONADO (PEDAGÓGICO) ── */}
            <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6 space-y-3.5">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                            Efecto escalonado · {sessionMeta.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {sessionMeta.laggedNote}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {LAGGED_STEPS.map((step) => {
                        const isReached = displayedRecord.session >= step.session;
                        const isCurrentFocus = displayedRecord.session === step.session;
                        return (
                            <div
                                key={step.session}
                                className={cn(
                                    "rounded-xl border px-3 py-2 text-xs transition-colors",
                                    isCurrentFocus
                                        ? "bg-card border-primary/50 shadow-sm"
                                        : isReached
                                          ? "bg-card/70 border-border/80"
                                          : "bg-background/40 border-border/50 opacity-70"
                                )}
                            >
                                <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-muted-foreground">
                                        {step.from}
                                    </span>
                                    {isReached && (
                                        <CheckCircle2
                                            className="h-3.5 w-3.5 text-primary"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>
                                <p className="font-semibold text-foreground mt-0.5">
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── 4. ACCIONES FINALES (SIN BOTÓN DE CORREGIR SESIÓN) ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setView("indicators")}
                        className="h-11 px-4 rounded-xl font-semibold"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Ver los 5 indicadores
                    </Button>

                    {!allFiveCompleted && (
                        <Button
                            type="button"
                            onClick={() => onNewSession(nextSuggestedSession)}
                            className="h-11 px-5 rounded-xl font-bold"
                        >
                            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Empezar Sesión {nextSuggestedSession}
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-end">
                    {!confirmReset ? (
                        <button
                            type="button"
                            onClick={() => setConfirmReset(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-rose-600 transition-colors py-2 px-2"
                        >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Borrar historial local
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">¿Borrar tus sesiones?</span>
                            <button
                                type="button"
                                onClick={onClearHistory}
                                className="font-bold text-rose-600 hover:underline"
                            >
                                Sí, borrar
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmReset(false)}
                                className="font-semibold text-muted-foreground hover:text-foreground"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizResultMain;
