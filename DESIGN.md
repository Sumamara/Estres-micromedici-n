---
name: Perfil de Autoconciencia del Estrés y Regulación (PAEM-18)
description: Sistema de diseño sobrio, clínico y editorial para evaluación de balance biológico y carga psicofisiológica
colors:
  primary: "hsl(215, 70%, 45%)"
  primary-foreground: "#FFFFFF"
  secondary: "hsl(215, 40%, 95%)"
  secondary-foreground: "hsl(215, 70%, 30%)"
  neutral-bg: "hsl(40, 33%, 98%)"
  card-bg: "#FFFFFF"
  foreground: "hsl(220, 20%, 18%)"
  muted: "hsl(40, 15%, 94%)"
  muted-foreground: "hsl(220, 10%, 45%)"
  accent: "hsl(12, 76%, 58%)"
  border: "hsl(220, 15%, 88%)"
  zone-reserve: "#10b981"
  zone-tension: "#f59e0b"
  zone-wear: "#f97316"
  zone-burnout: "#e11d48"
  surface-sky: "hsl(215 70% 96%)"
  whatsapp-cta: "#25D366"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  metrics:
    fontFamily: "Inter, monospace, system-ui"
    fontSize: "1.25rem"
    fontWeight: 700
    fontVariantNumeric: "tabular-nums"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
    height: "56px"
  card-base:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

## Overview
El sistema visual de PAEM-18 combina el rigor psicométrico de la investigación clínica con una calidez editorial que transmite serenidad y auto-reflexión. Su estética está inspirada en publicaciones científicas contemporáneas y diarios de campo (*Editorial PSS*), huyendo conscientemente de la "productividad tóxica", las alertas alarmistas de color rojo estridente y los paneles de control gamificados estilo neón.

## Colors
- **Fondo Base (`neutral-bg` / `hsl(40, 33%, 98%)`)**: Tono marfil/arena suave que reduce la fatiga visual frente a pantallas con blanco puro.
- **Texto Principal (`foreground` / `hsl(220, 20%, 18%)`)**: Azul grisáceo pizarra de alto contraste (WCAG AAA) para lectura prolongada sin estridencias.
- **Azul Primario de Regulación (`primary` / `hsl(215, 70%, 45%)`)**: Evoca claridad cognitiva, respaldo científico y serenidad reflexiva. Es el color de las acciones principales (*CTAs*: «Empezar el test», opciones seleccionadas). El botón de WhatsApp usa su verde propio.
- **Coral (`accent` / `hsl(12, 76%, 58%)`)**: Reservado; hoy no se usa en la interfaz. No usarlo para CTAs (decisión: los CTAs van en azul primario).
- **Cuadrantes de Balance (Carga vs. Recuperación)**:
  - `Óptimo` (`#10b981`, ink `#047857`): Carga `< 50%` y Recuperación `>= 60%`.
  - `Vulnerable` (`#f59e0b`, ink `#b45309`): Carga `< 50%` y Recuperación `< 60%`.
  - `Sobrecarga` (`#f97316`, ink `#c2410c`): Carga `>= 50%` y Recuperación `>= 60%`.
  - `Riesgo de Burnout` (`#e11d48`, ink `#be123c`): Carga `>= 50%` y Recuperación `< 60%`.
- **Superficie Celeste (`SKY` / `hsl(215 70% 96%)`)**: Fondo de lectura sereno usado en la Historia 2 (señales y costo) y en la Historia 4 (cierre del taller).

## Typography
- **Encabezados (`Outfit`, pesos 500/600/700)**: Fuente display sans con proporciones geométricas humanistas (`font-bold`, `leading-[1.12]` en titulares largos de cierre).
- **Cuerpo de Lectura (`Inter`, pesos 400/500/600/700)**: Tipografía de lectura neutra y legible en pantallas móviles.
- **Cifras y Datos (`tabular-nums`)**: Uso mandatorio de números tabulares en marcadores cuantitativos, porcentajes de carga/recuperación y progreso.

## Layout
- **Ancho Contenido**: Contenedor centrado `max-w-2xl` para bienvenida/preguntas y tarjeta móvil `max-w-md` (`h-dvh sm:h-[760px]`) para el resultado en formato Historias (`ResultStories.tsx`).
- **Ritmo Vertical**: Módulo base de 8px; áreas scrollables (`flex-1 min-h-0 overflow-y-auto`) con gradiente de desvanecimiento inferior y footer fijo en historias de acción (`story4` y `story5`).
- **Transición Cognitiva**: Pantalla de descanso (*interstitial breather card*) al completar la Parte A antes de iniciar la Parte B, y transición animada hacia el resultado.

## Elevation & Depth
- **Estratificación Tonal**: La jerarquía se construye primordialmente mediante contraste de tonos de superficie (`neutral-bg`, `card-bg`, `SKY`, franja `bg-primary`) y bordes sutiles (`border-border/80`).
- **Sombras Funcionales**: Sombra suave difusa (`shadow-sm`, `shadow-md`, `sm:shadow-2xl`) reservada para el marco móvil de historias, tarjetas interactivas activas y el CTA principal.

## Shapes
- **Bordes Suaves**: Radio de `rounded-xl` (12px) en botones y campos, `rounded-2xl` (16px) en tarjetas internas y `sm:rounded-3xl` en el contenedor de historias en desktop.
- **Balanza y Cuadrante 2×2**: Balanza SVG animada (`TiltBalanceSolid`) y matriz 2×2 (`QuadrantStory1`) con ejes de Carga y Recuperación.

## Components
- **Historias Interactivas (`ResultStories.tsx`)**: Barra superior de progreso segmentada (4 o 5 pasos), navegación por bordes (`EDGE = 0.22`), swipe horizontal (`> 45px`) y teclado (`ArrowLeft`/`ArrowRight`), protegiendo zonas de lectura/acción con `data-no-tap`.
- **Acordeones de Cierre (`story4`)**: Filas expandibles con `min-h-[54px]`, `aria-expanded`, `aria-controls` e `inert` cuando están cerradas (sin `hint` para mantener limpieza visual).
- **Selector de Respuestas**: Botones tipo tarjeta con radio semántico, feedback visual inmediato al tacto y atajos numéricos (1–6).
- **Botón de Acción Principal**: Altura de 56px (`h-14 rounded-xl`); en el cierre de WhatsApp usa `#25D366` con `text-black`, acompañado de navegación explícita `← Anterior` y `Volver a hacer el test` (`min-h-[44px]`).

## Do's and Don'ts
- **DO**: Usar números tabulares (`tabular-nums`) siempre que se muestren cifras o porcentajes.
- **DO**: Mantener los nombres aprobados de las zonas (*Óptimo*, *Vulnerable*, *Sobrecarga*, *Riesgo de Burnout*).
- **DO**: Mantener contraste WCAG AA (≥ 4.5:1 en texto normal, `text-white/95` sobre `primary`) y proteger áreas de lectura/footer con `data-no-tap`.
- **DON'T**: Usar `font-extrabold` (800) sobre `Outfit` (no está importado en `index.css`; usar `font-bold` 700).
- **DON'T**: Mostrar diagnósticos que juzguen moralmente al usuario o usar lenguaje punitivo.
- **DON'T**: Forzar registros o capturas de correo previas a mostrar el resultado completo.

