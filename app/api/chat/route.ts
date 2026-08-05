import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/chatbot";
import { SYSTEM_PROMPT } from "@/lib/chatbot-content";
import { searchKnowledge } from "@/lib/searchKnowledge";
import { isAllowedTopic } from "@/lib/topicFilter";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message: string = body.message;

        // 1. Cari di knowledge internal
        const localAnswer = searchKnowledge(message);

        if (!isAllowedTopic(message)) {
            return NextResponse.json({
                text: "Maaf, saya hanya dapat membantu mengenai CarbonTide, blue carbon, mangrove, MRV, carbon credit, dan fitur-fitur aplikasi CarbonTide."
            });
        }

        if (localAnswer) {
            return NextResponse.json({
                text: localAnswer,
                source: "knowledge",
            });
        }

        // 2. Jika tidak ditemukan, baru gunakan Gemini
        const content = `
        ${SYSTEM_PROMPT}

        Pertanyaan pengguna:

        ${message}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: content,
        });

        return NextResponse.json({
            

            text: response.text ?? "Maaf, saya tidak dapat menjawab pertanyaan tersebut.",
            source: "gemini",
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}