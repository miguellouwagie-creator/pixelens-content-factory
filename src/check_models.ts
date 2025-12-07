import dotenv from 'dotenv';

// Cargar API Key
dotenv.config();
// Truco: Forzamos a que sea string o cadena vacía para que TS no llore
const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
    console.error("❌ ERROR: No hay GEMINI_API_KEY en el archivo .env");
    process.exit(1);
}

async function listModels() {
    console.log("📡 Conectando con Google para listar tus modelos disponibles...");
    console.log(`🔑 Usando Key que empieza por: ${apiKey.substring(0, 10)}...`);
    console.log("-------------------------------------------------------------");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        // Truco: Le decimos a TS que 'data' es 'any' (cualquier cosa) para que nos deje leerlo
        const data: any = await response.json();

        if (data.error) {
            console.error("❌ ERROR DE GOOGLE:", data.error.message);
            return;
        }

        if (!data.models) {
            console.log("⚠️ No se encontraron modelos. Tu API Key podría no tener permisos activados.");
            return;
        }

        console.log("✅ MODELOS DISPONIBLES PARA TI:");
        const availableModels = data.models
            .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
            .map((m: any) => m.name.replace('models/', ''));

        availableModels.forEach((model: string) => {
            console.log(`   - ${model}`);
        });

        console.log("-------------------------------------------------------------");
        console.log("💡 COPIA uno de estos nombres exactos para usarlo en tu código.");

    } catch (error) {
        console.error("❌ Error de conexión:", error);
    }
}

listModels();