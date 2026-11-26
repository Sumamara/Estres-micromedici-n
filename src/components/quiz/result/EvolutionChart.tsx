"use client";

import { useState } from "react";
import {
    INDICADORES,
    SESIONES,
    formatSessionDate,
    type IndicatorId,
    type PulseHistory,
    type SessionNumber,
} from "../quizData";
import { cn } from "@/lib/utils";

interface EvolutionChartProps {
    history: PulseHistory | null;
    activeSession: SessionNumber;
}

const Y_TICKS = [0, 20, 40, 60, 80, 100];

const CHART_W = 600;
const CHART_H = 266;
const PAD_LEFT = 46;
const PAD_RIGHT = 24;
const PAD_TOP = 18;
const PAD_BOTTOM = 48;

const PLOT_W = CHART_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM;

const xForSession = (sessionNum: number) =>
    PAD_LEFT + ((sessionNum - 1) / 4) * PLOT_W;

const yForValue = (val: number) =>
    PAD_TOP + PLOT_H - (val / 100) * PLOT_H;

const EvolutionChart = ({ history, activeSession }: EvolutionChartProps) => {
    const [focusedId, setFocusedId] = useState<IndicatorId | "all">("all");

    const recordedSessions = SESIONES.filter((s) => Boolean(history?.sessions[s.num]));
    const recordedCount = recordedSessions.length;

    return (
        <div className="space-y-4">
            {/* ── FILTROS INTERACTIVOS POR INDICADOR ── */}
            <div className="flex flex-wrap items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => setFocusedId("all")}
                    className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                        focusedId === "all"
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-muted-foreground border-border hover:text-foreground"
                    )}
                >
                    Todos (5)
                </button>
                {INDICADORES.map((ind) => {
                    const isActive = focusedId === ind.id;
                    return (
                        <button
                            key={ind.id}
                            type="button"
                            onClick={() =>
                                setFocusedId(isActive ? "all" : ind.id)
                            }
                            className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                                isActive
                                    ? "bg-card text-foreground shadow-sm ring-1 ring-inset"
                                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                            )}
                            style={
                                isActive
                                    ? {
                                          borderColor: ind.colorHex,
                                          boxShadow: `0 0 0 1px ${ind.colorHex}33`,
                                      }
                                    : undefined
                            }
                        >
                            <span
                                className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    ind.goal === "down" && "ring-1 ring-offset-1 ring-rose-500/60"
                                )}
                                style={{ backgroundColor: ind.colorHex }}
                                aria-hidden="true"
                            />
                            <span>
                                {ind.shortName}
                                {ind.goal === "down" ? " ↓" : ""}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── GRÁFICA SVG RESPONSIVA (S1 → S5) ── */}
            <div className="w-full overflow-hidden rounded-xl border border-border/70 bg-background/60 p-2 sm:p-3">
                <svg
                    viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label="Gráfica evolutiva de los 5 indicadores a lo largo de las 5 sesiones"
                >
                    {/* Banda sutil en la sesión activa */}
                    <rect
                        x={xForSession(activeSession) - 28}
                        y={PAD_TOP - 4}
                        width={56}
                        height={PLOT_H + 8}
                        rx={8}
                        className="fill-primary/[0.06]"
                    />

                    {/* Líneas horizontales de referencia (0% a 100%) */}
                    {Y_TICKS.map((tick) => {
                        const y = yForValue(tick);
                        return (
                            <g key={tick}>
                                <line
                                    x1={PAD_LEFT}
                                    y1={y}
                                    x2={CHART_W - PAD_RIGHT}
                                    y2={y}
                                    stroke="currentColor"
                                    strokeOpacity={tick === 0 ? 0.2 : 0.09}
                                    strokeDasharray={tick === 0 ? undefined : "3 4"}
                                />
                                <text
                                    x={PAD_LEFT - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-muted-foreground text-[11px] font-medium tabular-nums"
                                >
                                    {tick}%
                                </text>
                            </g>
                        );
                    })}

                    {/* Etiquetas del eje X (Sesión + fecha) */}
                    {SESIONES.map((s) => {
                        const x = xForSession(s.num);
                        const rec = history?.sessions[s.num];
                        const isCurrent = s.num === activeSession;
                        const dateStr = formatSessionDate(rec?.completedAt);
                        return (
                            <g key={s.num}>
                                <text
                                    x={x}
                                    y={CHART_H - 22}
                                    textAnchor="middle"
                                    className={cn(
                                        "text-[12px] tabular-nums",
                                        isCurrent
                                            ? "fill-primary font-bold"
                                            : rec
                                              ? "fill-foreground font-semibold"
                                              : "fill-muted-foreground/60 font-medium"
                                    )}
                                >
                                    {s.label}
                                </text>
                                {dateStr && (
                                    <text
                                        x={x}
                                        y={CHART_H - 8}
                                        textAnchor="middle"
                                        className="fill-muted-foreground text-[10px] font-medium"
                                    >
                                        {dateStr}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Curvas y puntos de cada indicador */}
                    {INDICADORES.map((ind) => {
                        const isDimmed = focusedId !== "all" && focusedId !== ind.id;
                        const isFocused = focusedId === ind.id;
                        const isInverse = ind.goal === "down";

                        const points = SESIONES.map((s) => {
                            const rec = history?.sessions[s.num];
                            if (!rec) return null;
                            return {
                                session: s.num,
                                val: rec.scores[ind.id],
                                x: xForSession(s.num),
                                y: yForValue(rec.scores[ind.id]),
                            };
                        }).filter((p): p is NonNullable<typeof p> => p !== null);

                        if (points.length === 0) return null;

                        const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

                        return (
                            <g
                                key={ind.id}
                                style={{
                                    opacity: isDimmed ? 0.14 : 1,
                                    transition: "opacity 200ms ease",
                                }}
                            >
                                {points.length > 1 && (
                                    <polyline
                                        fill="none"
                                        stroke={ind.colorHex}
                                        strokeWidth={isFocused ? 3.5 : 2.5}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeDasharray={isInverse ? "6 4" : undefined}
                                        points={polylinePoints}
                                    />
                                )}

                                {points.map((pt) => (
                                    <g key={`${ind.id}-${pt.session}`}>
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isFocused ? 6 : 4.5}
                                            fill={ind.colorHex}
                                            stroke="white"
                                            strokeWidth={2}
                                        />
                                        {isFocused && (
                                            <text
                                                x={pt.x}
                                                y={pt.y - 11}
                                                textAnchor="middle"
                                                className="text-[11px] font-bold tabular-nums"
                                                fill={ind.colorHex}
                                            >
                                                {pt.val}%
                                            </text>
                                        )}
                                    </g>
                                ))}
                            </g>
                        );
                    })}
                </svg>

                {/* Leyenda breve */}
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-muted-foreground">
                    <span>
                        {recordedCount === 1
                            ? "Línea base registrada. Al completar la siguiente sesión se conectará tu curva evolutiva."
                            : `Mostrando evolución de ${recordedCount} de 5 sesiones. Tocá un indicador arriba para ver sus porcentajes exactos.`}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                        <span className="inline-block w-4 border-t-2 border-dashed border-rose-500" />
                        Carga Corporal (meta: ↓ bajar)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EvolutionChart;
