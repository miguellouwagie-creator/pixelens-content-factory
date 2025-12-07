/**
 * Strategy Exporter Service
 * Generates rich Markdown strategy briefs in Spanish
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ContentPiece } from '../types.js';
import { BRAND } from '../constants/brand.js';
import { ensureDirectory, formatDateForDisplay, log } from '../utils/helpers.js';

/**
 * Initialize strategy briefs file with header
 */
export async function initializeStrategyFile(outputPath: string): Promise<void> {
    await ensureDirectory(path.dirname(outputPath));

    const header = `# ${BRAND.name} - Laboratorio de Estrategia de Contenido

**Generado:** ${formatDateForDisplay(new Date())}  
**Audiencia:** ${BRAND.targetAudience.join(', ')}  
**Tono:** ${BRAND.voice.tone}

---

`;

    await fs.writeFile(outputPath, header, 'utf-8');
    log('info', 'Initialized strategy briefs file');
}

/**
 * Export strategy brief for a single trend to Markdown
 */
export async function exportStrategyBrief(
    contentPiece: ContentPiece,
    outputPath: string
): Promise<void> {
    const { id, sourceUrl, analysis, strategy } = contentPiece;

    const briefBlock = `
## 📊 Trend: ${id}

**Fuente Original:** [${sourceUrl || 'N/A'}](${sourceUrl || '#'})  
**Fecha de Análisis:** ${formatDateForDisplay(contentPiece.createdAt)}

---

### 🧠 Análisis Psicológico: ¿Por qué es viral?

**Patrón del Hook:**  
${analysis.hookPattern}

**Elementos Virales:**
${analysis.viralElements.map(el => `- ${el}`).join('\n')}

**Desglose de Estructura:**  
${analysis.structureBreakdown}

**Aprendizajes Clave:**
${analysis.keyTakeaways.map(tk => `- ${tk}`).join('\n')}

---

### 🎯 Estrategia A: VIRAL (Instagram/Twitter)

**Hook:**  
> ${strategy.hook_viral}

**Objetivo:** Máximo alcance y compartidos. Tono polémico y memorable.

---

### 🎓 Estrategia B: AUTORIDAD (LinkedIn)

**Hook:**  
> ${strategy.hook_authority}

**Objetivo:** Construir confianza y demostrar expertise. Tono profesional con datos.

---

### 💰 Estrategia C: VENTAS (Conversión)

**Hook:**  
> ${strategy.hook_sales}

**Objetivo:** Generar leads y acción inmediata. Tono persuasivo centrado en beneficios.

---

### 📝 Caption Principal (Post Completo)

${strategy.caption_main}

---

### 🎨 Brief Visual para Diseñador

**Instrucciones para Nano Banana:**

${strategy.visual_brief}

**Paleta de Marca:**
- Fondo: \`${BRAND.visual.colors.background}\`
- Superficie: \`${BRAND.visual.colors.surface}\`
- Texto Principal: \`${BRAND.visual.colors.primary}\`
- Acento: \`${BRAND.visual.colors.accent}\`
- Tipografía: ${BRAND.visual.typography.primary} (cuerpo), ${BRAND.visual.typography.secondary} (títulos)

---

`;

    // Append to file
    await fs.appendFile(outputPath, briefBlock, 'utf-8');
    log('info', `Strategy brief exported: ${id}`);
}
