"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Activity,
    ArrowRight,
    Clock,
    LineChart,
    ListChecks,
    Pencil,
    Percent,
    User,
} from "lucide-react";
import {
    type PulseHistory,
    type SessionNumber,
} from "./quizData";
import { PULSE_META } from "@/content/pulso";

interface QuizWelcomeProps {
    onStart: (name: string, session: SessionNumber) => void;
    onViewHistory?: () => void;
    initialName?: string;
    nextSession: SessionNumber;
    history?: PulseHistory | null;
}

/* ── Marca minimalista de pulso evolutivo ── */
export const PulseMark = () => (
    <div
        className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20"
        aria-hidden="true"
    >
        <Activity className="h-7 w-7" strokeWidth={2.25} />
    </div>
);

const QuizWelcome = ({
    onStart,
    onViewHistory,
    initialName = "",
    nextSession,
    history = null,
}: QuizWelcomeProps) => {
    const hasSavedName = Boolean(initialName.trim());
    const [name, setName] = useState(initialName);
    const [isEditingName, setIsEditingName] = useState(!hasSavedName);
    const [showError, setShowError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingName && hasSavedName) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditingName, hasSavedName]);

    const completedSessions = history
        ? (Object.keys(history.sessions).map(Number) as SessionNumber[])
        : [];
    const hasHistory = completedSessions.length > 0;

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setShowError(true);
            setIsEditingName(true);
            return;
        }
        onStart(trimmed, nextSession);
    };

    return (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none">
            <div className="space-y-5 sm:space-y-7 text-center px-5 pt-6 sm:px-10 sm:pt-10 bg-card border rounded-2xl shadow-sm">
                {/* ── MARCA + TITULAR ── */}
                <div className="space-y-3 sm:space-y-4">
                    <PulseMark />

                    <div className="space-y-2">
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
                            Micro-Pulso Semanal
                        </p>
                        <h1 className="text-[1.85rem] sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12] [text-wrap:balance]">
                            {PULSE_META.title}
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto [text-wrap:balance] leading-snug sm:leading-relaxed">
                            {PULSE_META.subtitle}
                        </p>
                    </div>

                    {/* ── 1 MINUTO · 5 INDICADORES · 0% A 100% ── */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-background/80 text-xs sm:text-sm font-semibold text-foreground">
                            <Clock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                            {PULSE_META.durationLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-background/80 text-xs sm:text-sm font-semibold text-foreground">
                            <ListChecks className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                            {PULSE_META.countLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-background/80 text-xs sm:text-sm font-semibold text-foreground">
                            <Percent className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                            {PULSE_META.scaleLabel}
                        </span>
                    </div>
                </div>

                {/* ── FORMULARIO: NOMBRE (FIJO SI YA EXISTE) + EMPEZAR SESIÓN ── */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="max-w-md mx-auto space-y-5 text-left"
                >
                    {!isEditingName && name.trim() ? (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/70 px-4 py-3.5">
                            <div className="flex items-center gap-3 min-w-0">
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                                    aria-hidden="true"
                                >
                                    <User className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        Participante
                                    </p>
                                    <p className="text-base font-bold text-foreground truncate">
                                        {name.trim()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingName(true)}
                                className="shrink-0 rounded-lg text-xs font-semibold"
                            >
                                <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                Cambiar nombre
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <label htmlFor="name-input" className="text-sm font-bold text-foreground">
                                ¿Cómo te llamás?
                            </label>
                            <Input
                                ref={inputRef}
                                id="name-input"
                                autoComplete="given-name"
                                placeholder="Tu nombre"
                                required
                                aria-required="true"
                                aria-invalid={showError || undefined}
                                aria-describedby="name-hint"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (showError && e.target.value.trim()) setShowError(false);
                                }}
                                maxLength={40}
                                className={cn(
                                    "h-12 sm:h-13 text-base sm:text-lg rounded-xl border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                    showError && "border-rose-500 focus-visible:ring-rose-500"
                                )}
                            />
                            <p
                                id="name-hint"
                                role={showError ? "alert" : undefined}
                                className={cn(
                                    "text-xs",
                                    showError
                                        ? "text-rose-600 font-semibold"
                                        : "text-muted-foreground"
                                )}
                            >
                                {showError
                                    ? "Escribí tu nombre para empezar."
                                    : "Tu nombre quedará guardado para las próximas sesiones."}
                            </p>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="space-y-2.5 pt-1">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-13 sm:h-14 text-base sm:text-lg font-bold rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            Empezar Sesión {nextSession}
                            <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
                        </Button>

                        {hasHistory && onViewHistory && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onViewHistory}
                                className="w-full h-11 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-xl"
                            >
                                <LineChart className="mr-1.5 h-4 w-4" aria-hidden="true" />
                                Ver mi curva actual ({completedSessions.length}/5{" "}
                                {completedSessions.length === 1 ? "sesión" : "sesiones"})
                            </Button>
                        )}
                    </div>
                </form>

                {/* Pie de la tarjeta */}
                <p className="!mt-4 sm:!mt-7 mx-auto max-w-md border-t border-border/60 py-3 sm:py-5 text-center text-[13px] italic text-muted-foreground">
                    Medición de control ·{" "}
                    <span className="not-italic font-semibold text-foreground/80">
                        {PULSE_META.brandName}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default QuizWelcome;
