/**
 * Gemini AI Service - PRODUCTION GRADE
 * Optimized for User's Available Models (2.0 Flash Stable & 2.5 Flash)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult, CreatorResult, DesignerResult, ViralTrend } from '../types.js';
import { PROMPTS } from '../constants/brand.js';
import { sleep, log, extractJSON, safeJSONParse } from '../utils/helpers.js';

// LISTA PRIORIZADA DE MODELOS (Basada en tu diagnóstico real)
const MODELS_TO_TRY = [
    'gemini-2.0-flash',       // PRIMARIA: Versión estable y rápida
    'gemini-2.5-flash',       // SECUNDARIA: Nueva generación (muy capaz)
    'gemini-2.0-flash-lite',  // TERCIARIA: Backup ligero
    'gemini-2.0-pro-exp',     // CUARTA: Potencia bruta (experimental)
    'gemini-2.0-flash-exp'    // QUINTA: El viejo confiable (con límites bajos)
] as const;

export class GeminiService {
    private ai: GoogleGenerativeAI;
    private model: any;
    private currentModelName: string;
    private apiDelayMs: number;
    private lastCallTime: number = 0;

    constructor(apiKey: string, apiDelayMs: number = 5000) { // Delay base 5s (suficiente para modelos estables)
        if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
        this.ai = new GoogleGenerativeAI(apiKey);
        this.apiDelayMs = apiDelayMs;

        // Empezamos con el campeón
        this.currentModelName = MODELS_TO_TRY[0];
        this.initializeModel(this.currentModelName);
    }

    private initializeModel(modelName: string): void {
        log('info', `🔧 Initializing model strategy: ${modelName}`);
        this.model = this.ai.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
            },
        });
        this.currentModelName = modelName;
    }

    private async applyRateLimit(): Promise<void> {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        if (timeSinceLastCall < this.apiDelayMs) {
            const waitTime = this.apiDelayMs - timeSinceLastCall;
            if (waitTime > 1000) log('info', `⏳ Pace control: waiting ${Math.round(waitTime / 1000)}s`);
            await sleep(waitTime);
        }
        this.lastCallTime = Date.now();
    }

    /**
     * Llamada a API con "Supervivencia" (Cambio de modelo automático)
     */
    private async callAPI(prompt: string, maxRetries: number = 3): Promise<string> {
        // Encontrar índice actual o resetear a 0
        let currentModelIndex = MODELS_TO_TRY.indexOf(this.currentModelName as any);
        if (currentModelIndex === -1) currentModelIndex = 0;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            await this.applyRateLimit();

            try {
                log('info', `⚡ Generating with ${this.currentModelName} (Attempt ${attempt}/${maxRetries})`);
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                return response.text();

            } catch (error: any) {
                const errorMessage = String(error);
                const isRateLimit = errorMessage.includes('429') || errorMessage.includes('Quota') || errorMessage.includes('Too Many Requests');
                const isNotFound = errorMessage.includes('404') || errorMessage.includes('Not Found');

                log('warn', `⚠️ Error on ${this.currentModelName}: ${errorMessage.split('[')[0]}...`);

                // CASO 1: MODELO NO ENCONTRADO (404) -> CAMBIO INMEDIATO
                if (isNotFound) {
                    log('warn', `❌ Model ${this.currentModelName} not found (404). Switching...`);
                    currentModelIndex++;
                    if (currentModelIndex < MODELS_TO_TRY.length) {
                        this.initializeModel(MODELS_TO_TRY[currentModelIndex]);
                        attempt--; // No gastamos intento, probamos el nuevo ya
                        continue;
                    }
                }

                // CASO 2: LÍMITE DE VELOCIDAD (429) -> ESPERA + REINTENTO (o cambio si persiste)
                if (isRateLimit) {
                    log('warn', `🛑 Rate Limit Hit (429). Pausing for 60s...`);
                    await sleep(60000); // Pausa de seguridad

                    // Si ya fallamos una vez con este modelo por rate limit, cambiamos al siguiente
                    if (attempt > 1) {
                        log('warn', `🔄 Still rate limited. Switching model to escape block...`);
                        currentModelIndex++;
                        if (currentModelIndex < MODELS_TO_TRY.length) {
                            this.initializeModel(MODELS_TO_TRY[currentModelIndex]);
                        }
                    }
                    continue;
                }

                // Otros errores
                if (attempt === maxRetries) throw error;
                await sleep(5000);
            }
        }
        throw new Error('All models/retries exhausted');
    }

    // --- MÉTODOS DE NEGOCIO ---

    async analyzeViralStructure(trend: ViralTrend): Promise<AnalysisResult> {
        log('info', `🧠 Analyzing viral DNA for: ${trend.id}`);
        const prompt = PROMPTS.analyst
            .replace('{caption}', trend.caption)
            .replace('{likes}', trend.likes.toString())
            .replace('{comments}', trend.comments.toString())
            .replace('{engagementRate}', trend.engagementRate.toFixed(2));

        const response = await this.callAPI(prompt);
        return safeJSONParse<AnalysisResult>(extractJSON(response), {
            hookPattern: 'Analysis Failed', viralElements: [], structureBreakdown: response, keyTakeaways: []
        });
    }

    async createBrandContent(analysis: AnalysisResult): Promise<CreatorResult> {
        log('info', '✍️  Drafting new content...');
        const prompt = PROMPTS.creator.replace('{analysis}', JSON.stringify(analysis, null, 2));

        const response = await this.callAPI(prompt);
        return safeJSONParse<CreatorResult>(extractJSON(response), {
            headline: 'Error', body: response, cta: 'Error', keywords: [], tone: 'Error'
        });
    }

    async designVisualTemplate(content: CreatorResult): Promise<DesignerResult> {
        log('info', '🎨 Designing visuals...');
        const prompt = PROMPTS.designer.replace('{content}', JSON.stringify(content, null, 2));

        const response = await this.callAPI(prompt);
        return safeJSONParse<DesignerResult>(extractJSON(response), {
            htmlSnippet: '', designNotes: response, colorScheme: []
        });
    }

    async processTrend(trend: ViralTrend) {
        log('info', `🚀 Processing Trend: ${trend.id}`);
        const analysis = await this.analyzeViralStructure(trend);
        const content = await this.createBrandContent(analysis);
        const visual = await this.designVisualTemplate(content);
        log('info', `✅ Finished: ${trend.id}`);
        return { analysis, content, visual };
    }
}