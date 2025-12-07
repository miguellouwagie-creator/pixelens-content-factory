# Prompt Engineering - Pixelens Content Factory

This document explains the AI prompt strategy used in the three-step content transformation pipeline.

## 🎯 Overall Strategy

Each step in the pipeline has a distinct focus:

1. **Analyst** - Extract viral mechanics (structure, hooks, patterns)
2. **Creator** - Generate brand-aligned content using those mechanics
3. **Designer** - Visualize content in brand-consistent format

All prompts request JSON output for easy parsing and error handling.

## 📊 Step 1: The Analyst

### Goal
Understand *why* a post went viral by extracting its underlying structure.

### Prompt Structure

```
You are a viral content analyst. Analyze the following post and extract its underlying structure.

POST: {caption}
ENGAGEMENT: {likes, comments, engagementRate}

Your task:
1. Identify the HOOK PATTERN (how it captures attention)
2. List the VIRAL ELEMENTS (what made it shareable)
3. Break down the STRUCTURE (opening, body, close)
4. Extract KEY TAKEAWAYS (principles to apply)

Return JSON: {hookPattern, viralElements, structureBreakdown, keyTakeaways}
```

### What We Look For

- **Hook Pattern**: "Controversial statement", "Bold claim with data", "Personal story twist", etc.
- **Viral Elements**: Social proof, specificity, emotional triggers, pattern interrupts
- **Structure**: How information flows from attention → engagement → action
- **Key Takeaways**: Transferable principles (not content-specific)

### Example Analysis

**Input:** "Most designers never learn this: Your website speed matters MORE than your design..."

**Output:**
```json
{
  "hookPattern": "Contrarian statement with authority positioning",
  "viralElements": [
    "Pattern interrupt ('never learn this')",
    "Data-backed claim (1s delay = 7% drop)",
    "Specific case study (43% revenue increase)",
    "Enemy positioning (WordPress)"
  ],
  "structureBreakdown": "Hook → Bold claim → Proof point → Solution → CTA",
  "keyTakeaways": [
    "Lead with contrarian insight",
    "Support with specific data",
    "Include transformation story",
    "Position against common alternative"
  ]
}
```

## ✍️ Step 2: The Creator

### Goal
Write NEW content for Studio Pixelens using the viral structure but with our brand voice.

### Prompt Structure

```
You are a content strategist for Studio Pixelens, a luxury web design agency.

BRAND VOICE: {tone, keywords, philosophy}
VIRAL STRUCTURE TO EMULATE: {analysis from Step 1}

Your task:
Create a NEW post that:
1. Uses the same HOOK PATTERN but about high-end web design
2. Maintains our authoritative, minimalist tone (NO clickbait)
3. Incorporates our keywords naturally
4. Provides genuine value to agency owners/decision-makers

Return JSON: {headline, body, cta, keywords, tone}
```

### Key Constraints

- **NO copying** - Must be original content
- **Brand alignment** - Keywords: Astro, Performance, Custom Code, Luxury UI
- **Tone discipline** - Avoid emojis, clickbait, hype
- **Audience aware** - Speak to decision-makers, not casual browsers

### Example Creation

**Using analysis from above:**

```json
{
  "headline": "Most agencies never learn this: Custom code outperforms templates in every metric that matters.",
  "body": "We analyzed 50 high-end brand websites. The pattern was clear: Custom-coded sites convert 2.3x better than Webflow/WordPress. Why? Load times under 1 second. Zero plugin conflicts. 100% brand expression. Your competitors are still dragging templates. You could be shipping art.",
  "cta": "Ready to build without limits? Let's talk.",
  "keywords": ["Custom Code", "Performance", "Luxury UI", "Astro"],
  "tone": "Authoritative, data-driven, minimalist"
}
```

## 🎨 Step 3: The Designer

### Goal
Create an HTML/CSS visual that matches our minimalist brand aesthetic.

### Prompt Structure

```
You are a visual designer for Studio Pixelens.

VISUAL STYLE: {theme, fonts, colors, aesthetic}
CONTENT TO VISUALIZE: {headline, body, cta from Step 2}

Your task:
Create an HTML snippet using Tailwind CSS for an Instagram carousel slide.

Requirements:
1. Dark mode colors from our palette
2. Typography: Inter (body), Playfair Display (headlines)
3. Generous whitespace, minimalist layout
4. Mobile-first (1080x1080 format)
5. Include headline, body, CTA prominently

Return JSON: {htmlSnippet, designNotes, colorScheme}
```

### Design Principles

- **Dark mode first** - Background: #0a0a0a, Surface: #1a1a1a
- **Typography hierarchy** - Playfair for headlines (serif elegance), Inter for body (clean readability)
- **Whitespace** - No cramming. Less is more.
- **Color discipline** - Primary white, Accent blue (#3b82f6), Muted grey (#6b7280)

### Fallback

If AI-generated HTML is incomplete or malformed, we use our template function:

```typescript
createCarouselSlide(headline, body, cta)
```

This ensures visual consistency even if the AI fails.

## 🔄 Iteration & Refinement

### When to Adjust Prompts

1. **Low-quality analysis** → Add more examples in system context
2. **Off-brand content** → Strengthen brand constraints, add negative examples
3. **Poor visuals** → Provide HTML template as example in prompt

### Testing Strategy

1. Run pipeline on 3-5 diverse viral posts
2. Review outputs for:
   - Brand voice accuracy
   - Structural consistency
   - Visual quality
3. Refine prompts based on patterns
4. Re-run and compare

### Prompt Versioning

Track prompt changes in git to identify what works:

```bash
# Good practice
git commit -m "prompt: strengthen anti-clickbait constraint in Creator"
```

## 📈 Success Metrics

How to know if prompts are working:

- **Analysis quality**: Can you identify the viral pattern from the JSON alone?
- **Content originality**: Is it clearly different from the source but structurally similar?
- **Brand alignment**: Would you publish this as Studio Pixelens?
- **Visual consistency**: Does it match our aesthetic at first glance?

## 🛠️ Advanced Techniques

### Few-Shot Examples

Add example outputs to prompts for better results:

```
Example analysis:
{
  "hookPattern": "Personal failure story with redemption",
  "viralElements": ["Vulnerability", "Specificity ($15K)", "Transformation"],
  ...
}

Now analyze this post:
{caption}
```

### Chain of Thought

Ask AI to explain reasoning before outputting:

```
Before returning JSON, briefly explain your reasoning:
- Why is this hook pattern effective?
- What makes these elements viral?

Then return the JSON.
```

### Temperature Control

Adjust creativity via API parameters:

- **Analysis** - Low temperature (0.3) for consistency
- **Creation** - Medium temperature (0.7) for creativity with control
- **Design** - Low temperature (0.4) for brand consistency

## 📚 Resources

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Gemini API Best Practices](https://ai.google.dev/docs/prompt_best_practices)
- [On Writing by Stephen King](https://en.wikipedia.org/wiki/On_Writing:_A_Memoir_of_the_Craft) - For voice and tone

---

**Remember:** Good prompts are iterative. Start simple, test, refine, repeat.
