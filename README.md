# Pixelens Content Factory

**Transform viral content into brand-aligned posts for Studio Pixelens**

An intelligent AI agent that analyzes viral trends and creates polished, on-brand content using Google's Gemini API.

## 🎯 Philosophy

> "Steal like an Artist" - Analyze the viral structure, completely rewrite the substance.

This tool doesn't copy viral content. Instead, it:
1. **Analyzes** the underlying hook patterns and structural elements
2. **Creates** new content using those patterns, tailored to our brand voice
3. **Designs** minimalist visual templates for Instagram

## 🏗️ Architecture

```
┌─────────────────┐
│ viral_trends.json│
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ LOADER │ - Validate & load trends
    └───┬────┘
        │
        ▼
    ┌──────────┐
    │PROCESSOR │ - AI Pipeline (3 steps)
    └───┬──────┘
        │
        ├─► ANALYST  → Extract viral structure
        ├─► CREATOR  → Generate branded content
        └─► DESIGNER → Create visual template
        │
        ▼
    ┌─────────┐
    │EXPORTER │
    └───┬─────┘
        │
        ├─► content_calendar.md
        └─► visuals/post-*.html
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
copy .env.example .env

# Edit .env and add your API key
# GEMINI_API_KEY=your_key_here
```

### Usage

```bash
# Build the TypeScript project
npm run build

# Run with sample data
npm start

# Or use custom input file
# Set INPUT_FILE=your-trends.json in .env, then:
npm start
```

## 📁 Project Structure

```
pixelens-content-factory/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── types.ts                 # TypeScript type definitions
│   ├── config/
│   │   └── loader.ts            # Configuration loader
│   ├── constants/
│   │   └── brand.ts             # Brand voice & AI prompts
│   ├── services/
│   │   └── gemini.ts            # Gemini AI integration
│   ├── pipeline/
│   │   ├── loader.ts            # Load viral trends
│   │   ├── processor.ts         # Process through AI
│   │   └── exporter.ts          # Export results
│   ├── templates/
│   │   └── pixelens-layout.ts   # HTML templates
│   └── utils/
│       └── helpers.ts           # Utility functions
├── package.json
├── tsconfig.json
├── .env.example
├── sample-viral-trends.json     # Sample input data
└── README.md
```

## ⚙️ Configuration

Edit `.env` to customize:

```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional
API_DELAY_MS=2000                    # Delay between API calls
INPUT_FILE=viral_trends.json         # Input file path
OUTPUT_CALENDAR=content_calendar.md  # Output markdown file
OUTPUT_VISUALS_DIR=visuals           # Visual templates directory
```

## 📊 Input Format

The app expects `viral_trends.json` with this structure:

```json
[
  {
    "id": "unique-id",
    "username": "creator_name",
    "caption": "The viral post text...",
    "likes": 5000,
    "comments": 150,
    "engagementRate": 15.5,
    "postUrl": "https://...",
    "hashtags": ["webdesign", "tech"]
  }
]
```

See `sample-viral-trends.json` for a complete example.

## 📤 Output

### 1. Content Calendar (`content_calendar.md`)

A structured markdown file containing:
- Post headline, body, and CTA
- Viral analysis breakdown
- Keywords and metadata
- Links to visual templates

### 2. Visual Templates (`visuals/post-*.html`)

Individual HTML files with:
- Dark mode design
- Inter & Playfair Display fonts
- 1080x1080 Instagram format
- Minimalist, brand-aligned aesthetic

Open any `.html` file in a browser to preview.

## 🎨 Brand Voice

The AI is trained with Studio Pixelens brand guidelines:

**Tone:** Minimalist, authoritative, technical but accessible

**Keywords:** Astro, Performance, Custom Code, Anti-Wordpress, Luxury UI

**Visual Style:** Dark mode, clean typography, generous whitespace

**Avoids:** Clickbait, emojis, salesy language

## 🔧 Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run development mode (build + run)
npm run dev

# Clean build files
npm run clean
```

## 🐛 Troubleshooting

### API Rate Limits

If you hit rate limits, increase `API_DELAY_MS` in `.env`:

```bash
API_DELAY_MS=3000  # 3 seconds between calls
```

### Invalid API Key

Ensure your `.env` file has a valid Gemini API key:

1. Get key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`
3. Restart the application

### No Trends Loaded

Check that:
- `viral_trends.json` exists (or use `sample-viral-trends.json`)
- JSON is valid (use a validator)
- Trends have required fields: `id`, `username`, `caption`, `likes`, `comments`

## 📚 Learn More

- [Prompt Engineering Guide](docs/prompt-engineering.md) - How the AI prompts work
- [Google Gemini API Docs](https://ai.google.dev/docs)

## 📄 License

MIT - Studio Pixelens

---

**Built with:** TypeScript, Node.js, Google Gemini API  
**Philosophy:** Steal like an Artist 🎨
