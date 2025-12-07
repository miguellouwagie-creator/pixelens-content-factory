/**
 * Brand constants for Studio Pixelens - STRATEGY LAB
 * Prompts for Spanish B2B copywriting strategy engine
 */

export const BRAND = {
    name: 'Studio Pixelens',

    voice: {
        tone: 'Experto accesible - Profesional sin ser aburrido',
        avoid: ['clickbait', 'lenguaje vendedor', 'emojis excesivos', 'TODO MAYÚSCULAS'],
        prefer: ['valor real', 'educación', 'datos verificables', 'premium'],
    },

    keywords: [
        'Astro',
        'Rendimiento',
        'Código Personalizado',
        'Anti-Wordpress',
        'UI de Lujo',
        'Diseño Web Premium',
        'Desarrollo a Medida',
        'Velocidad Extrema',
        'Optimización de Conversión',
    ],

    targetAudience: [
        'Directores de hoteles españoles',
        'CEOs de PYMEs',
        'Propietarios de agencias',
        'Tomadores de decisión B2B',
    ],

    visual: {
        theme: 'Dark mode',
        typography: {
            primary: 'Inter',
            secondary: 'Playfair Display',
        },
        colors: {
            background: '#0a0a0a',
            surface: '#1a1a1a',
            primary: '#ffffff',
            accent: '#3b82f6',
            muted: '#6b7280',
        },
        spacing: 'Generous whitespace',
        aesthetic: 'Clean, minimalist, luxurious',
    },

    philosophy: 'Roba como un Artista - analiza estructura viral, reescribe completamente el contenido',

    contentPrinciples: [
        'Lidera con valor, no con bombo',
        'Respalda afirmaciones con datos o ejemplos',
        'Educa, no solo promociones',
        'Habla a propietarios de agencias y tomadores de decisiones',
        'Posiciónate como socio estratégico, no proveedor',
    ],
} as const;

/**
 * AI prompt templates - SPANISH STRATEGY LAB
 */
export const PROMPTS = {
    analyst: `You are a viral content analyst. Analyze the following post and extract its underlying structure.

POST:
{caption}

ENGAGEMENT:
- Likes: {likes}
- Comments: {comments}
- Engagement Rate: {engagementRate}%

Your task:
1. Identify the HOOK PATTERN (how it captures attention)
2. List the VIRAL ELEMENTS (what made it shareable)
3. Break down the STRUCTURE (opening, body, close)
4. Extract KEY TAKEAWAYS (principles to apply)

Return your analysis in JSON format with keys: hookPattern, viralElements, structureBreakdown, keyTakeaways.`,

    strategist: `Eres un estratega de contenido experto para ${BRAND.name}, una agencia de diseño web premium.

AUDIENCIA OBJETIVO: ${BRAND.targetAudience.join(', ')}.
TONO: ${BRAND.voice.tone}
PALABRAS CLAVE: ${BRAND.keywords.join(', ')}
FILOSOFÍA: ${BRAND.philosophy}

ESTRUCTURA VIRAL ANALIZADA:
{analysis}

EJEMPLO DE ESTILO PERFECTO:
"Wordpress está matando tus márgenes de agencia. Deja de crear deuda técnica. Migramos un cliente a Astro y sus costes de servidor cayeron un 90%. La velocidad no es un lujo, es retención. Tus competidores siguen arrastrando plantillas; tú podrías estar creando arte."

CRÍTICO: Imita el TONO y ESTRUCTURA de FRASES - corto, directo, autoritario. Sin relleno.

Tu tarea:
Genera 3 variantes de copy en ESPAÑOL (España) perfectamente adaptadas a esta estructura viral:

1. **HOOK VIRAL** (Instagram/Twitter): 
   - Estilo: Directo, polémico, memorable
   - Objetivo: Máximo alcance y shares
   - Longitud: 1-2 frases impactantes

2. **HOOK AUTORIDAD** (LinkedIn):
   - Estilo: Data-driven, académico, creíble
   - Objetivo: Construir confianza y expertise
   - Longitud: 2-3 frases profesionales con datos

3. **HOOK VENTAS** (Conversión):
   - Estilo: Persuasivo, centrado en beneficios tangibles
   - Objetivo: Generar leads y acción
   - Longitud: 2-3 frases con value proposition clara

También incluye:
- **CAPTION PRINCIPAL**: El mensaje core de valor en 3-4 frases. Educativo pero convincente.
- **BRIEF VISUAL**: Descripción detallada para diseñador en Nano Banana (ej: "Imagen minimalista modo oscuro mostrando gráfico de rendimiento con colores #0a0a0a fondo, tipografía Inter, datos en azul #3b82f6, estilo premium...")

IMPORTANTE: TODO el copy debe estar en español de España (no América Latina). Usa vocabulario B2B profesional.

Devuelve JSON con: hook_viral, hook_authority, hook_sales, caption_main, visual_brief`,
} as const;
