import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// create a gemini api client (that's edge friendly!)
const client = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = client.languageModel("gemini-2.0-flash-exp");

// set the runtime to edge
export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: NextRequest) {
    try {
        // Define system prompt
        const systemPrompt = `Create a list of three open-ended and engaging questions formatted as a single
        string. Each question should be separated by '||'. These questions are for an anonymous social
        messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal
        or sensitive topics, focusing instead on universal themes that encourage friendly interaction.
        For example, your output should be structured like this: "What's a hobby you have recently started? || 
        If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?"
        Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming 
        conversational environment.`;
        
        // Get data from request body
        const { prompt }: { prompt: string } = await request.json();
        console.log(prompt);
        
        // Use streamText with the model and system prompt
        const result = streamText({
            model,
            prompt: prompt,
            system: systemPrompt,
            maxTokens: 1500,
        });
    
        // Return a text stream response using the method directly
        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in suggest-messages route:", error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        } else {
            console.error("An unexpected error occurred: ", error);
            throw error;
        }
    }
}