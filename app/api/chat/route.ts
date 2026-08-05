import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/chatbot";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message = body.message;

        const content = `Kamu adalah chabot interaktif dari sebuah aplikasi. 
                        Berikan aku langsung jawaban singkat (tidak terlalu singkat dan tidak terlalu panjang), 
                        serta tanpa kalimat pembuka ataupun penutup, dari pertanyaan berikut ini: \"${message}\"`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: content,
        })

        const botMessage = response.text || "can't answer";

        return NextResponse.json({
            text: botMessage,
        });
        
    } catch (error) {
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}