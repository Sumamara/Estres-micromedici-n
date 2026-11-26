# 🧭 Índice de Archivos y Arquitectura · Medición de control

Este índice sirve como mapa rápido para ubicar el archivo exacto a consultar o modificar según la necesidad, manteniendo una referencia clara de la arquitectura del proyecto **Medición de control** (Micro-Pulso semanal SIMs / EMA · 5 indicadores · Sesiones 1 a 5).

---

## 1. Flujo Activo de Producción (Lo que experimenta el participante)

| Archivo | Descripción de una línea | Cuándo usarlo |
| :--- | :--- | :--- |
| [`src/content/pulso.ts`](./src/content/pulso.ts) | **Fuente única de la verdad** para todos los textos de la encuesta: escala de 6 niveles (0% a 100%), los 5 indicadores (Desconectar, Organizar, Recargar, Regular, Carga Corporal inversa) y el enfoque pedagógico de las Sesiones 1 a 5. | **Siempre** que necesites modificar redacción, preguntas, metas o notas del efecto escalonado. |
| [`src/components/quiz/QuizEngine.tsx`](./src/components/quiz/QuizEngine.tsx) | Orquestador general del flujo: maneja bienvenida, paso a paso, borrador en `localStorage` (`medicion-control-progreso-v1`), historial por sesión, lectura opcional de `?sesion=1..5` y transición al panel de resultados. | Cuando quieras cambiar la lógica de avance, persistencia de borrador o selección inicial de sesión. |
| [`src/components/quiz/QuizWelcome.tsx`](./src/components/quiz/QuizWelcome.tsx) | Pantalla de inicio con campo de nombre, selector visual de Sesión (1 a 5) con marcas de sesiones completadas y acceso directo a la curva actual si ya existe historial local. | Cuando quieras modificar la pantalla inicial, el selector de sesiones o los textos de introducción. |
| [`src/components/quiz/QuizQuestion.tsx`](./src/components/quiz/QuizQuestion.tsx) | Componente que renderiza cada uno de los 5 indicadores con su badge de meta (`↑ Subir` / `↓ Bajar`), escala táctil de 6 niveles (0% a 100%) y soporte para teclado (1–6 y flechas). | Cuando quieras modificar el diseño de las preguntas, la barra de progreso o las interacciones táctiles. |
| [`src/components/quiz/QuizResultMain.tsx`](./src/components/quiz/QuizResultMain.tsx) | Panel único de resultados: índice global de control, curva evolutiva de 5 semanas, bloque de efecto escalonado, comparativa vs. sesión anterior y guardado automático en Supabase (`Estres_Pulso`). | Cuando quieras ajustar el panel final, la lógica de deltas o el guardado en la nube. |
| [`src/components/quiz/result/EvolutionChart.tsx`](./src/components/quiz/result/EvolutionChart.tsx) | Gráfica SVG interactiva de 5 semanas (S1 → S5) con filtros por indicador, línea punteada para Carga Corporal inversa y etiquetas de porcentaje al enfocar un indicador. | Para modificar la visualización gráfica de la evolución semanal. |
| [`src/components/quiz/quizData.ts`](./src/components/quiz/quizData.ts) | Motor de cálculo e historial local (`medicion-control-historial-v1`): calcula el Índice de Control (invirtiendo Carga Corporal), deltas entre sesiones y sugerencia automática de la siguiente sesión. | Cuando necesites ajustar fórmulas, umbrales del índice global o persistencia en `localStorage`. |

---

## 2. Páginas, Rutas y Componentes Base (`src/app/`, `src/components/`)

| Archivo | Descripción de una línea | Cuándo usarlo |
| :--- | :--- | :--- |
| [`src/app/page.tsx`](./src/app/page.tsx) | Ruta principal (`/`) que monta `<QuizEngine />`. | Cuando quieras modificar el contenedor exterior de la página principal. |
| [`src/app/layout.tsx`](./src/app/layout.tsx) | Layout raíz con fuentes, metadatos SEO/OpenGraph de **Medición de control** y configuración global. | Cuando quieras agregar fuentes, analítica o actualizar metatags. |
| [`src/app/not-found.tsx`](./src/app/not-found.tsx) | Página de error 404 personalizada y accesible. | Para modificar el mensaje de ruta no encontrada. |
| [`src/components/Providers.tsx`](./src/components/Providers.tsx) | Envoltorio cliente global con `QueryClientProvider`, `TooltipProvider` y notificaciones (`Toaster`, `Sonner`). | Cuando necesites agregar proveedores de contexto globales. |
| [`src/components/ui/`](./src/components/ui/) | Primitivos de interfaz reutilizables estilo shadcn/ui (`button.tsx`, `input.tsx`, `sonner.tsx`, `toast.tsx`, `toaster.tsx`, `tooltip.tsx`). | Para ajustar componentes visuales base compartidos en toda la app. |

---

## 3. Datos, Base de Datos y Utilidades (`src/lib/`, `src/hooks/`)

| Archivo | Descripción de una línea | Cuándo usarlo |
| :--- | :--- | :--- |
| [`src/lib/saveQuizResult.ts`](./src/lib/saveQuizResult.ts) | Envía los 5 indicadores, la sesión (1–5) y el índice global de control a la tabla `Estres_Pulso` en Supabase en segundo plano. | Para modificar qué campos se persisten en la base de datos al finalizar el pulso. |
| [`src/lib/supabaseClient.ts`](./src/lib/supabaseClient.ts) | Cliente inicializado de Supabase con fallback seguro para no romper la UI si faltan variables de entorno. | Para revisar o actualizar la conexión a Supabase. |
| [`src/lib/utils.ts`](./src/lib/utils.ts) | Helper `cn()` para combinar clases CSS condicionales con Tailwind. | Para utilidades de clases. |
| [`src/hooks/use-toast.ts`](./src/hooks/use-toast.ts) | Hook para invocar mensajes emergentes (toasts). | Para mostrar notificaciones flotantes. |

---

## 4. Documentación y Base de Datos

| Archivo | Descripción de una línea | Cuándo usarlo |
| :--- | :--- | :--- |
| [`setup_estres_pulso_table.sql`](./setup_estres_pulso_table.sql) | Script SQL idempotente para crear la tabla `Estres_Pulso`, sus índices y política RLS (`INSERT` para `anon`) en Supabase. | Para inicializar la tabla nueva en tu proyecto de Supabase. |
| [`README.md`](./README.md) | Documento general del proyecto e instrucciones de instalación. | Vista de presentación y onboarding del repositorio. |
| [`PRODUCT.md`](./PRODUCT.md) | Visión de producto y tono de voz (voseo). | Para verificar consistencia de tono y propósito. |
| [`DESIGN.md`](./DESIGN.md) | Tokens de diseño, tipografías y reglas visuales base. | Como referencia de consistencia estética. |

---

## 5. Estilos, Configuración, SEO y Despliegue

| Archivo | Descripción de una línea | Cuándo usarlo |
| :--- | :--- | :--- |
| [`src/index.css`](./src/index.css) | Estilos CSS globales y variables semánticas HSL del tema. | Para cambiar estilos globales o variables de color. |
| [`tailwind.config.ts`](./tailwind.config.ts) | Configuración de Tailwind CSS (colores semánticos, fuentes y radios de borde). | Para extender temas o utilidades de Tailwind. |
| [`next.config.js`](./next.config.js) | Configuración de Next.js con exportación estática (`output: 'export'`), `trailingSlash` y `basePath` dinámico (`RUTA_BASE`). | Para ajustar el modo de compilación o la ruta base del despliegue. |
| [`netlify.toml`](./netlify.toml) | Configuración de despliegue estático en Netlify (`out/`), variables de entorno y cabeceras HTTP. | Para modificar reglas de build, headers o enrutamiento en producción. |
| [`.env.example`](./.env.example) | Plantilla de variables de entorno requeridas (Supabase, URL del sitio y ruta base). | Como referencia al configurar un entorno local o de despliegue. |
| [`package.json`](./package.json) | Manifiesto del proyecto con dependencias y scripts de desarrollo y compilación. | Para verificar scripts o actualizar paquetes. |
| [`public/`](./public/) | Assets públicos y SEO: `robots.txt`, `sitemap.xml`, `llms.txt`, favicons y `og_banner_estres_final.jpg`. | Para actualizar metadatos públicos, OpenGraph o directivas para rastreadores. |
