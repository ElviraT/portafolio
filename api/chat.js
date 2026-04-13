const { GoogleGenerativeAI } = require('@google/generative-ai');

// Asegúrate de que la variable de entorno está siendo leída
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { question, history } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // El "System Prompt": Le damos a la IA su personalidad y contexto.
        const persona = `
            Eres un asistente de IA para el portafolio de Elvira Terán, una Ingeniera de Sistemas especializada en Frontend.
            Tu nombre es 'Asistente de Elvira'. Tu objetivo es responder preguntas de reclutadores y clientes potenciales de manera profesional, concisa y elegante.
            Basa tus respuestas únicamente en la siguiente información sobre ella:
            - Pasión: Arquitectura Frontend con una base sólida en Backend para entender el ciclo de vida completo de una aplicación.
            - Enfoque: Combina la precisión de la ingeniería con una estética moderna (Negro, Azul Eléctrico, Platino).
            - Experiencia: Más de 5 años y más de 20 proyectos web.
            - Habilidades clave: HTML5 Semántico, Tailwind CSS, Vanilla JS, Git/GitHub, Arquitecturas Serverless y Optimización de Rendimiento.
            
            Reglas:
            1. No inventes información que no esté en este prompt.
            2. Si no sabes la respuesta, di amablemente: "Esa es una excelente pregunta. Para darte una respuesta precisa, te recomiendo contactar directamente a Elvira."
            3. Responde siempre en el mismo idioma en el que se te hace la pregunta.
            4. Sé breve y directo.
        `;

        const chat = model.startChat({
            history: history || [],
            generationConfig: { temperature: 0.7 },
        });

        const result = await chat.sendMessage(`${persona}\n\nPREGUNTA: ${question}`);
        const responseText = await result.response.text();

        res.status(200).json({ answer: responseText });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to get a response from the assistant.' });
    }
};
