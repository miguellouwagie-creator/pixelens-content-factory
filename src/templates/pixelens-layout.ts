/**
 * Pixelens HTML layout template
 * Provides consistent structure for all visual outputs
 */

import { BRAND } from '../constants/brand.js';

/**
 * Generate complete HTML document with Pixelens branding
 */
export function createPixelensLayout(bodyContent: string, title: string = 'Studio Pixelens'): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: ${BRAND.visual.colors.background};
      color: ${BRAND.visual.colors.primary};
      line-height: 1.6;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Playfair Display', serif;
      font-weight: 600;
      line-height: 1.2;
    }
    
    .container {
      width: 1080px;
      height: 1080px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }
    
    .surface {
      background-color: ${BRAND.visual.colors.surface};
    }
    
    .accent {
      color: ${BRAND.visual.colors.accent};
    }
    
    .muted {
      color: ${BRAND.visual.colors.muted};
    }
  </style>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'brand-bg': '${BRAND.visual.colors.background}',
            'brand-surface': '${BRAND.visual.colors.surface}',
            'brand-primary': '${BRAND.visual.colors.primary}',
            'brand-accent': '${BRAND.visual.colors.accent}',
            'brand-muted': '${BRAND.visual.colors.muted}',
          },
          fontFamily: {
            'sans': ['Inter', 'sans-serif'],
            'serif': ['Playfair Display', 'serif'],
          }
        }
      }
    }
  </script>
</head>
<body>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="container">
      ${bodyContent}
    </div>
  </div>
  
  <!-- Branding Footer -->
  <div class="fixed bottom-4 right-4 text-xs text-brand-muted">
    ${BRAND.name}
  </div>
</body>
</html>`;
}

/**
 * Create Instagram carousel slide template
 */
export function createCarouselSlide(headline: string, body: string, cta: string): string {
    return `<div class="w-full h-full bg-brand-bg flex flex-col justify-between p-16">
  <!-- Header -->
  <div class="space-y-6">
    <div class="text-brand-accent text-sm font-medium tracking-wider uppercase">
      ${BRAND.name}
    </div>
    
    <h1 class="font-serif text-5xl font-semibold leading-tight text-brand-primary">
      ${headline}
    </h1>
  </div>
  
  <!-- Body Content -->
  <div class="space-y-8 flex-grow flex items-center">
    <p class="text-xl text-brand-primary leading-relaxed">
      ${body}
    </p>
  </div>
  
  <!-- Call to Action -->
  <div class="space-y-4">
    <div class="h-px bg-brand-accent w-16"></div>
    <p class="text-lg font-medium text-brand-accent">
      ${cta}
    </p>
  </div>
</div>`;
}
