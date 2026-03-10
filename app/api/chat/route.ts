import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize API Key safely
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        const { message, language } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
            return NextResponse.json(
                { error: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env.local file.' },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `You are Kisan Sahayak, an expert agricultural assistant in India. 
Your goal is to provide concise, practical, and highly accurate advice to rural farmers.
Keep your answers brief (under 50 words if possible) so they can be easily spoken by a voice assistant.
Respond in the language requested by the user. If the user asks in Hindi, respond in Hindi. If in English, respond in English.
The requested response language for this query is: ${language === 'hi-IN' ? 'Hindi' : 'English'}.

Please maintain a respectful and empathetic tone. Provide actionable steps regarding crops, fertilizers, weather, market prices, or farming schemes.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        const reply = response.text;

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('Gemini API Error:', error);

        // Pass the actual message back to the frontend
        return NextResponse.json(
            { error: error?.message || 'Failed to process request with Gemini AI' },
            { status: 500 }
        );
    }
}
