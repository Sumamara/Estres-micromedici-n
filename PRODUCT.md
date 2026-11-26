# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Perfil Principal:** Profesionales, personas autónomas y mandos intermedios con alta carga cognitiva y demandas diarias exigentes.
- **Situación:** Sienten cansancio o prisa constante, pero dudan si su estrés es «normal» o si su cuerpo ya está absorbiendo un costo silencioso sin lograr desconectar al final de la jornada.
- **Trabajo a realizar (Job-to-be-Done):** Obtener claridad objetiva sobre su estado fisiológico actual y saber con exactitud qué herramienta práctica necesitan para evitar el agotamiento o la sobrecarga crónica.

## Product Purpose

- **Qué hace:** Evalúa de forma estructurada en 18 preguntas la tensión acumulada (Parte A: Mente, Emociones, Cuerpo, Hábitos) en contraste con la capacidad real de descanso y regulación del usuario (Parte B: Freno y Recuperación).
- **Por qué existe:** La mayoría de tests de estrés solo miden síntomas negativos sin evaluar si el individuo cuenta con herramientas reales de descarga biológica.
- **Criterio de éxito:** Que el participante complete el test en ~2 minutos (sin registro), reconozca su situación cotidiana en el diagnóstico ("efecto espejo") y tome acción solicitando información del taller vía WhatsApp (o la sesión de cortesía en Riesgo de Burnout) sin fricción previa.

## Positioning

- **Balance Carga vs. Recuperación (Cuadrante 2×2):** A diferencia de escalas unidimensionales que solo dan un puntaje de "estrés alto o bajo", la herramienta evalúa **Carga diaria** (`< 50%` vs `>= 50%`) frente a **Recuperación** (`>= 60%` vs `< 60%`), ubicando a la persona en uno de cuatro estados accionables.
- **Formato Historias + Puente Directo a la Práctica:** El resultado se entrega en 4 historias interactivas (5 en *Riesgo de Burnout*, con una sesión gratuita 1 a 1 en 2.ª posición), conectando las señales del usuario con una micro-herramienta práctica inmediata para hoy y las 5 sesiones del taller.

## Operating Context

- **Entorno de uso:** Principalmente teléfonos móviles (tráfico proveniente de enlaces compartidos, redes sociales o mensajería directa) y ocasionalmente navegadores de escritorio.
- **Momento:** Se responde en momentos de pausa laboral, al final del día o durante un pico de saturación mental. Requiere lectura serena y sin distracciones.

## Capabilities and Constraints

- **Sin fricción de entrada:** Flujo anónimo e inmediato; no se exige registro con contraseña ni pago previo para ver el diagnóstico completo.
- **Persistencia transparente:** Los resultados cuantitativos y respuestas se sincronizan en segundo plano en Supabase para analítica y seguimiento sin interrumpir al usuario.
- **Conexión asistida:** Enlace profundo pre-redactado hacia WhatsApp con el resultado de zona y la sesión recomendada ya configurados para facilitar el contacto.
- **Terminología obligatoria:** Se utiliza la nomenclatura de "Carga diaria", "Recuperación" y las cuatro zonas visibles del cuadrante: *Óptimo* (`resiliente`), *Vulnerable* (`fragil`), *Sobrecarga* (`bajo-presion`) y *Riesgo de Burnout* (`riesgo-burnout`).

## Brand Commitments

- **Tono y Voz:** Sobrio, científico, respetuoso y cercano. Se evitan tanto el dramatismo alarmista como la autoayuda superficial.
- **Trato:** voseo costarricense en toda la interfaz («tenés», «podés», «pensá», «no lo pensés»). Nunca «tú» ni «usted».
- **Premisa ética:** "Una señal para observar tu balance hoy, no una etiqueta fija que te define".
- **Identidad visual:** Estilo Editorial PSS; paleta de papel arena/marfil (`#FAF9F6`, `#EFECE6`), tipografía nítida con números tabulares y acentos funcionales por zona de estrés.

## Evidence on Hand

- **Instrumento psicométrico:** Cuestionario de 18 ítems basado en dimensiones de estrés percibido y capacidad de regulación somática y cognitiva.
- **Mapeo curricular del Taller:** Estructura confirmada de 5 sesiones:
  1. Sesión 1: Desconectar (apagar la mente al final del día).
  2. Sesión 2: Organizar (gestión de carga y límites).
  3. Sesión 3: Recargar (recuperación somática y sueño profundo).
  4. Sesión 4: Regular (frenar picos de estrés en caliente).
  5. Sesión 5: Integrar (hábitos para la rutina sin recaer).

## Product Principles

1. **Claridad sobre volumen:** Menos números abstractos y más comprensión intuitiva del saldo de energía diario.
2. **Diagnóstico no estigmatizante:** Tratar al estrés como una relación matemática entre demanda y descarga biológica, no como un fallo personal.
3. **Fricción cero hacia la acción:** El diagnóstico debe entregar valor completo inmediato y ofrecer una ruta expedita para quien decida dar el siguiente paso en el taller.

## Accessibility & Inclusion

- Contraste tipográfico conforme a WCAG AA en todas las zonas cromáticas.
- Áreas táctiles de respuesta amplias (mínimo 54px en opciones de escala para uso ágil en móviles).
- Atributos semánticos (`role="meter"`, valores `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y `tabular-nums` en elementos de progreso).

