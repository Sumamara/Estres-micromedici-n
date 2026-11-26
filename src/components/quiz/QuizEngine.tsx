"use client";

import { useEffect, useRef, useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResultMain from "./QuizResultMain";
import QuizWelcome, { PulseMark } from "./QuizWelcome";
import {
    INDICADORES,
    answersToScores,
    clearPulseHistory,
    computeControlIndex,
    readPulseHistory,
    resolveSessionByDate,
    upsertPulseSession,
    type PulseHistory,
    type PulseSessionRecord,
    type SessionNumber,
} from "./quizData";

const DRAFT_STORAGE_KEY = "medicion-control-progreso-v1";
const DRAFT_TTL_MS = 12 * 60 * 60 * 1000;
const FINISH_DELAY_MS = 900;

interface SavedDraft {
    userName: string;
    session: SessionNumber;
    answers: (number | null)[];
    index: number;
    activeMs: number;
    savedAt: number;
}

const isValidSession = (val: unknown): val is SessionNumber =>
    typeof val === "number" && Number.isInteger(val) && val >= 1 && val <= 5;

const readDraft = (total: number): SavedDraft | null => {
    try {
        const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as SavedDraft;
        const valid =
            typeof data.userName === "string" &&
            isValidSession(data.session) &&
            Array.isArray(data.answers) &&
            data.answers.length === total &&
            Number.isInteger(data.index) &&
            data.index >= 0 &&
            data.index < total &&
            Date.now() - data.savedAt < DRAFT_TTL_MS;
        if (!valid) {
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const writeDraft = (data: SavedDraft) => {
    try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Sin acceso a localStorage
    }
};

const clearDraft = () => {
    try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
        // Sin acceso a localStorage
    }
};

const parseSessionFromUrl = (): SessionNumber | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const raw = Number(params.get("sesion") ?? params.get("session"));
    return isValidSession(raw) ? raw : null;
};

const QuizEngine = () => {
    const totalQuestions = INDICADORES.length;

    const [isReady, setIsReady] = useState(false);
    const [history, setHistory] = useState<PulseHistory | null>(null);
    const [userName, setUserName] = useState("");
    const [session, setSession] = useState<SessionNumber>(1);
    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(
        new Array(totalQuestions).fill(null)
    );
    const [hasStarted, setHasStarted] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [initialResultView, setInitialResultView] = useState<"indicators" | "curve">(
        "indicators"
    );
    const [activeRecord, setActiveRecord] = useState<PulseSessionRecord | null>(null);
    const [shouldPersistToCloud, setShouldPersistToCloud] = useState(false);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");

    const activeBaseMs = useRef(0);
    const segmentStart = useRef<number>(0);
    const elapsedMs = () => activeBaseMs.current + (Date.now() - segmentStart.current);

    useEffect(() => {
        const storedHistory = readPulseHistory();
        setHistory(storedHistory);

        const urlSession = parseSessionFromUrl();
        const savedDraft = readDraft(totalQuestions);

        if (savedDraft) {
            setUserName(savedDraft.userName);
            setSession(savedDraft.session);
            setAnswers(savedDraft.answers);
            setCurrentGlobalIndex(savedDraft.index);
            activeBaseMs.current = savedDraft.activeMs;
            segmentStart.current = Date.now();
            setHasStarted(true);
        } else {
            if (storedHistory?.userName) {
                setUserName(storedHistory.userName);
            }
            setSession(urlSession ?? resolveSessionByDate(storedHistory));
        }

        setIsReady(true);
    }, [totalQuestions]);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [currentGlobalIndex, showResult, isFinishing]);

    const handleStart = (name: string, selectedSession: SessionNumber) => {
        const emptyAnswers = new Array<number | null>(totalQuestions).fill(null);
        setUserName(name);
        setSession(selectedSession);
        setAnswers(emptyAnswers);
        setCurrentGlobalIndex(0);
        setShowResult(false);
        setInitialResultView("indicators");
        setHasStarted(true);
        setShouldPersistToCloud(false);
        activeBaseMs.current = 0;
        segmentStart.current = Date.now();
        setDirection("forward");

        writeDraft({
            userName: name,
            session: selectedSession,
            answers: emptyAnswers,
            index: 0,
            activeMs: 0,
            savedAt: Date.now(),
        });
    };

    const handleViewHistory = () => {
        if (!history) return;
        const completedNums = (Object.keys(history.sessions).map(Number) as SessionNumber[]).sort(
            (a, b) => b - a
        );
        const latestSession = completedNums[0];
        if (!latestSession) return;
        const latestRecord = history.sessions[latestSession];
        if (!latestRecord) return;

        setSession(latestSession);
        setActiveRecord(latestRecord);
        setInitialResultView("curve");
        setShouldPersistToCloud(false);
        setHasStarted(true);
        setShowResult(true);
    };

    const handleAnswer = (answer: number) => {
        setDirection("forward");
        const newAnswers = [...answers];
        newAnswers[currentGlobalIndex] = answer;
        setAnswers(newAnswers);

        if (currentGlobalIndex < totalQuestions - 1) {
            const nextIndex = currentGlobalIndex + 1;
            setCurrentGlobalIndex(nextIndex);
            writeDraft({
                userName,
                session,
                answers: newAnswers,
                index: nextIndex,
                activeMs: elapsedMs(),
                savedAt: Date.now(),
            });
        } else {
            const timeSpentSeconds = Math.max(1, Math.round(elapsedMs() / 1000));
            const scores = answersToScores(newAnswers as number[]);
            const controlIndex = computeControlIndex(scores);
            const record: PulseSessionRecord = {
                session,
                scores,
                controlIndex,
                completedAt: new Date().toISOString(),
                timeSpentSeconds,
            };

            const updatedHistory = upsertPulseSession(userName, record);
            setHistory(updatedHistory);
            setActiveRecord(record);
            setInitialResultView("indicators");
            setShouldPersistToCloud(true);
            clearDraft();

            setIsFinishing(true);
            setTimeout(() => {
                setIsFinishing(false);
                setShowResult(true);
            }, FINISH_DELAY_MS);
        }
    };

    const handleBack = () => {
        setDirection("backward");
        if (currentGlobalIndex > 0) {
            setCurrentGlobalIndex(currentGlobalIndex - 1);
        } else {
            clearDraft();
            setHasStarted(false);
        }
    };

    const handleSelectAnotherSession = (nextSession?: SessionNumber) => {
        clearDraft();
        setAnswers(new Array(totalQuestions).fill(null));
        setCurrentGlobalIndex(0);
        setShowResult(false);
        setHasStarted(false);
        setShouldPersistToCloud(false);
        setSession(nextSession ?? resolveSessionByDate(history));
    };

    const handleClearHistory = () => {
        clearDraft();
        clearPulseHistory();
        setHistory(null);
        setActiveRecord(null);
        setAnswers(new Array(totalQuestions).fill(null));
        setCurrentGlobalIndex(0);
        setSession(1);
        setShowResult(false);
        setHasStarted(false);
        setShouldPersistToCloud(false);
    };

    if (!isReady) return null;

    if (!hasStarted) {
        return (
            <QuizWelcome
                onStart={handleStart}
                onViewHistory={handleViewHistory}
                initialName={userName}
                nextSession={session}
                history={history}
            />
        );
    }

    if (isFinishing) {
        const firstName = userName.trim();
        return (
            <div
                className="w-full max-w-xl flex flex-col items-center justify-center text-center gap-5 min-h-[50vh] animate-in fade-in duration-300 motion-reduce:animate-none"
                role="status"
            >
                <PulseMark />
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        {firstName ? `Listo, ${firstName}.` : "Listo."}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        Registrando tu medición…
                    </p>
                </div>
            </div>
        );
    }

    if (showResult && activeRecord) {
        return (
            <QuizResultMain
                userName={userName}
                record={activeRecord}
                history={history}
                persistToCloud={shouldPersistToCloud}
                initialView={initialResultView}
                onNewSession={handleSelectAnotherSession}
                onClearHistory={handleClearHistory}
            />
        );
    }

    return (
        <div className="w-full flex justify-center min-h-[450px]">
            <QuizQuestion
                indicator={INDICADORES[currentGlobalIndex]}
                onAnswer={handleAnswer}
                onBack={handleBack}
                currentGlobalIndex={currentGlobalIndex}
                totalQuestions={totalQuestions}
                direction={direction}
                savedAnswer={
                    answers[currentGlobalIndex] !== null
                        ? answers[currentGlobalIndex]!
                        : undefined
                }
            />
        </div>
    );
};

export default QuizEngine;
