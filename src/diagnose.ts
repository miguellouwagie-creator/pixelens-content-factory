import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Cargar .env
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ NO API KEY FOUND in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const MODELS_TO_TEST = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro-002',
    'gemini-pro',
    'gemini-1.0-pro',
    'gemini-2.0-flash-exp'
];

async function test() {
    console.log("🔍 INICIANDO DIAGNÓSTICO DE MODELOS...");
    console.log("----------------------------------------");

    for (const modelName of MODELS_TO_TEST) {
        process.stdout.write(`Probando ${modelName.padEnd(25)} -> `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            if (response.text()) {
                console.log("✅ ¡FUNCIONA! (DISPONIBLE)");
            }
        } catch (error: any) {
            if (error.message.includes('404')) {
                console.log("❌ No encontrado (404)");
            } else if (error.message.includes('429')) {
                console.log("⚠️ Sobrecargado (429) - Pero existe");
            } else {
                console.log(`❌ Error: ${error.message.split('[')[0]}`);
            }
        }
    }
    console.log("----------------------------------------");
}

test();