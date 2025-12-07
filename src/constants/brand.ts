/**
 * Brand constants for Studio Pixelens
 * Used in AI prompts to maintain consistent brand voice and style
 */

export const BRAND = {
    name: 'Studio Pixelens',

    voice: {
        tone: 'Minimalist, authoritative, technical but accessible',
        avoid: ['clickbait', 'salesy language', 'emojis', 'ALL CAPS'],
        prefer: ['value-driven', 'educational', 'data-backed', 'premium'],
    },

    keywords: [
        'Astro',
        'Performance',
        'Custom Code',
        'Anti-Wordpress',
        'Luxury UI',
        'High-End Web Design',
        'Bespoke Development',
        'Lightning-Fast',
        'Conversion Optimization',
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

    philosophy: 'Steal like an Artist - analyze viral structure, completely rewrite substance',

    contentPrinciples: [
        'Lead with value, not hype',
        'Back claims with data or examples',
        'Educate, don\'t just promote',
        'Speak to agency owners and decision-makers',
        'Position as strategic partner, not vendor',
    ],
} as const;

/**
 * AI prompt templates
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

    creator: `You are a content strategist for ${BRAND.name}, a luxury web design agency.

BRAND VOICE: ${BRAND.voice.tone}
KEYWORDS: ${BRAND.keywords.join(', ')}
PHILOSOPHY: ${BRAND.philosophy}

VIRAL STRUCTURE TO EMULATE:
{analysis}

Your task:
Create a NEW post for ${BRAND.name} that:
1. Uses the same HOOK PATTERN but about high-end web design
2. Maintains our authoritative, minimalist tone (NO clickbait)
3. Incorporates our keywords naturally
4. Provides genuine value to agency owners/decision-makers

Return JSON with: headline, body, cta, keywords, tone.`,

    designer: `You are a visual designer for ${BRAND.name}.

VISUAL STYLE:
- Theme: ${BRAND.visual.theme}
- Fonts: ${BRAND.visual.typography.primary}, ${BRAND.visual.typography.secondary}
- Colors: ${JSON.stringify(BRAND.visual.colors)}
- Aesthetic: ${BRAND.visual.aesthetic}

CONTENT TO VISUALIZE:
{content}

Your task:
Create an HTML snippet using Tailwind CSS for an Instagram carousel slide.

Requirements:
1. Use dark mode colors from our palette
2. Typography: Inter for body, Playfair Display for headlines
3. Generous whitespace, minimalist layout
4. Mobile-first (Instagram format: 1080x1080)
5. Include the headline, body, and CTA prominently

Return JSON with: htmlSnippet, designNotes, colorScheme.`,
} as const;
