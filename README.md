# 🧠 Perfil de Autoconciencia del Estrés y Regulación — PAEM-18

Aplicación web interactiva desarrollada en **Next.js 14 (App Router)** y **Tailwind CSS**, basada en el **Protocolo PAEM-18** (*Evaluación Multidimensional de Autoconciencia del Estrés y Regulación*). 

En 18 preguntas y menos de 3 minutos, evalúa la relación biológica entre la **Carga de Desgaste (Parte A)** y los **Recursos de Regulación (Parte B)** del usuario, devolviendo un diagnóstico preciso en un formato interactivo de **Historias (Stories)** con micro-prácticas respaldadas por evidencia científica y conexión directa al taller práctico de 5 sesiones mediante WhatsApp.

---

## 🎯 Los 4 Perfiles Diagnósticos (Zonas)

A diferencia de los cuestionarios tradicionales que etiquetan el estrés de forma fija y alarmista, PAEM-18 calcula el **saldo biológico neto** (`Carga − Recuperación = Nivel de Desgaste`), ubicando al usuario en una de 4 zonas funcionales:

| Perfil / Zona | Rango | Dinámica Biológica | Qué significa y Enfoque |
| :--- | :---: | :--- | :--- |
| 🟢 **Óptimo** *(Resiliente)* | `0 – 25 pts` | Carga baja · Regulación alta | **Balance positivo:** Recuperás más energía de la que gastás. Tu descanso funciona. Enfoque en aprovechar la claridad mental para metas personales y proteger tu reserva ante semanas pesadas. |
| 🟡 **Vulnerable** *(Frágil)* | `26 – 50 pts` | Carga baja · Regulación baja | **Margen corto:** Venís cumpliendo con todo pero llegás al final de la semana con lo justo. Cualquier imprevisto te desestabiliza. Enfoque en aprender a poner límites y pausas antes de sumar más carga. |
| 🟠 **Sobrecarga** *(Bajo Presión)* | `51 – 75 pts` | Carga alta · Regulación media/alta | **Desgaste acumulado:** Gastás más energía de la que lográs recuperar. La jornada termina pero la mente sigue encendida con pendientes. Enfoque en desacelerar rumiación y cerrar cognitivamente el día. |
| 🔴 **Riesgo de Burnout** | `76 – 100 pts` | Carga alta · Regulación baja | **Alerta biológica:** Sistema nervioso desbordado, el cuerpo ya pasa factura física y el descanso ya no recarga. Enfoque urgente en regulación somática del sistema nervioso + **sesión de cortesía 1 a 1 de regalo**. |

---

## 📖 El Flujo de Salida: Formato Historias (Stories)

El resultado se presenta en una interfaz estilo *Web Stories* (óptima para móviles y navegación táctil, por toques en los bordes, deslizamiento o teclado):

1. **Historia 1 · Dónde estás hoy:**  
   Balanza dinámica de energía (`TiltBalanceSolid`) o cuadrante interactivo 2x2 (`QuadrantStory1`), validación empática del estado actual y nivel numérico de desgaste.
2. **Historia 2 · Identificación profunda:**  
   Reflejo de señales en los 4 canales evaluados (*Tu Mente*, *Tus Emociones*, *Tu Cuerpo*, *Tus Hábitos*), qué hay detrás de ese patrón cotidiano y cuánto cuesta seguir normalizándolo.
3. **Historia 3 · Un regalo para hoy (Herramienta inmediata):**  
   Micro-ejercicio práctico personalizado según el perfil con evidencia científica citada:
   - **Óptimo:** *Meta personal en 15 min* (Locke & Latham, 2002).
   - **Vulnerable:** *La pausa de 5 segundos antes de decir que sí* (Siegrist, 1996).
   - **Sobrecarga:** *Cierre de libreta al terminar el día* (Scullin et al., 2018).
   - **Riesgo de Burnout:** *El doble suspiro fisiológico para apagar la alerta* (Balban et al., 2023).
4. **Historia 4 · La solución (El Taller):**  
   Presentación del programa de 5 sesiones prácticas 1 a 1 (`Desconectar`, `Organizar`, `Recargar`, `Regular`, `Integrar`), testimonios reales, detalles de inversión y botón con enlace directo a WhatsApp con mensaje preconfigurado.
5. **Historia 5 · Regalo genuino 1 a 1** *(Exclusiva para Riesgo de Burnout)*:  
   Ofrecimiento sin costo ni compromiso comercial de una sesión de escucha y alivio inicial para personas en estado crítico de sobrecarga.

---

## 📋 Estructura Psicométrica (18 Ítems)

Se responde mediante una escala porcentual calibrada de 6 niveles (`5% Casi nunca`, `20% Rara vez`, `40% Ocasionalmente`, `60% Frecuentemente`, `80% Muy frecuentemente`, `95% Casi siempre`).

### Parte A: Carga de Desgaste (12 preguntas)
- **Dimensión 1 · Tu Mente (Saturación mental):** Pendientes desbordantes, imprevistos desestabilizantes, saturación para decidir/recordar.
- **Dimensión 2 · Tus Emociones (Reactividad emocional):** Prisa interna constante, poca paciencia/irritabilidad, dificultad para desacelerar al salir.
- **Dimensión 3 · Tu Cuerpo (Desgaste corporal):** Tensión muscular acumulada, somatizaciones (estómago, cabeza, pulsaciones), fatiga al despertar.
- **Dimensión 4 · Tus Hábitos y Límites (Reacciones conductuales):** Refugio en pantallas/comida/sustancias, bloqueo y aislamiento, incapacidad para decir «no».

### Parte B: Recursos de Regulación (6 preguntas)
- **Dimensión 5 · Capacidad de Desconexión y Recuperación:** Apagado cognitivo de pendientes, registro somático de tensión, hábitos de recarga sin culpa.
- **Dimensión 6 · Competencia de Manejo y Flexibilidad:** Sistema para ordenar el caos, uso productivo de la presión, comunicación asertiva de límites y delegación.

---

## 🛠️ Tecnologías y Arquitectura

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) con diseño semántico y componentes accesibles basados en [Radix UI](https://www.radix-ui.com/).
- **Iconografía y Animaciones:** Lucide React, animaciones SVG personalizadas y micro-interacciones táctiles.
- **Persistencia local:** `localStorage` (`paem18-progreso-v1`) con TTL de 24 horas para no perder el progreso si el usuario abre WhatsApp o recarga.
- **Base de Datos y Analítica:** [Supabase](https://supabase.com/) en segundo plano (`saveQuizResult.ts` -> tabla `Estres_Lead`), no bloquea la navegación si falla la red.
- **Tono y Voz:** Voseo costarricense sobrio, empático y fundamentado en clínica («tenés», «podés», «pensá»).

---

## 💻 Instalación y Desarrollo

```bash
# 1. Clonar o ingresar al repositorio
cd Lead_Estres

# 2. Instalar dependencias con pnpm
pnpm install

# 3. Iniciar servidor de desarrollo local
pnpm run dev

# 4. Compilar para producción
pnpm run build

# 5. Ejecutar verificación de tipos
npx tsc --noEmit
```

La aplicación se abrirá por defecto en `http://localhost:3000`.

---

## 🔍 SEO y AI SEO (GEO)

El proyecto incluye configuración explícita para buscadores tradicionales y motores de respuesta basados en IA:
- [`public/robots.txt`](file:///d:/1-Codigo/Code%20Web/7%20Encuesta%20Estres/Lead_Estres/public/robots.txt): Habilita explícitamente rastreadores de búsqueda (`Googlebot`, `Bingbot`), previews sociales (`WhatsApp`, `Twitterbot`, `facebookexternalhit`) y crawlers de IA (`OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`), junto con el enlace al `Sitemap`.
- [`public/llms.txt`](file:///d:/1-Codigo/Code%20Web/7%20Encuesta%20Estres/Lead_Estres/public/llms.txt): Resumen estructurado en Markdown para modelos de lenguaje con la descripción, metodología, 4 estados y entregables del test.
- [`public/sitemap.xml`](file:///d:/1-Codigo/Code%20Web/7%20Encuesta%20Estres/Lead_Estres/public/sitemap.xml): Mapa XML canónico del sitio.
- [`src/app/layout.tsx`](file:///d:/1-Codigo/Code%20Web/7%20Encuesta%20Estres/Lead_Estres/src/app/layout.tsx): Metadatos OpenGraph / Twitter Card, etiqueta canónica y datos estructurados **JSON-LD** (`WebApplication` + `FAQPage`).

---

## 🗄️ Configuración de Base de Datos (Supabase)

Para inicializar la persistencia de respuestas:
1. Dirígete al panel de tu proyecto en [Supabase](https://supabase.com/).
2. Abre el **SQL Editor**.
3. Ejecuta el archivo [`setup_paem18_table.sql`](file:///d:/1-Codigo/Code%20Web/7%20Encuesta%20Estres/Lead_Estres/setup_paem18_table.sql).
4. El script creará (o renombrará idempotentemente) la tabla `Estres_Lead` con sus columnas para las 18 preguntas, índices analíticos, métricas calculadas y políticas de seguridad RLS.
