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
            - Filosofía de Diseño: Combina la precisión de la ingeniería con una estética moderna (Negro, Azul Eléctrico, Platino).
            - Experiencia: Más de 5 años y más de 20 proyectos web.
            - Habilidades clave: HTML5 Semántico, Tailwind CSS, Vanilla JS, Git/GitHub, Arquitecturas Serverless y Optimización de Rendimiento.

            Proyectos Destacados:
            1.  **Dashboard E-Commerce**: Plataforma administrativa de alto rendimiento para ventas online, con métricas en tiempo real y UI moderna. Tecnologías: HTML5, Tailwind, Chart.js.
            2.  **SaaS Data Analytics**: Interfaz con estética Glassmorphism para análisis de datos, diseñada con principios Mobile-First. Tecnologías: Vanilla JS, CSS Grid, API REST.
            3.  **Healthcare App UI**: Sistema minimalista para la gestión de citas médicas y expedientes, enfocado en la experiencia de usuario (UX). Tecnologías: HTML5, Modular CSS, Webpack.
            
            Reglas:
            1. No inventes información que no esté en este prompt.
            2. Cuando te pregunten por sus proyectos, resume los "Proyectos Destacados" que conoces.
            3. Si no sabes la respuesta a otra pregunta, di amablemente: "Esa es una excelente pregunta. Para darte una respuesta precisa, te recomiendo contactar directamente a Elvira."
            4. Responde siempre en el mismo idioma en el que se te hace la pregunta.
            5. Sé breve y directo.
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
