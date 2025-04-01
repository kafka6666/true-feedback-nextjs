import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CoreMessage } from "ai";

// create a gemini api client (that's edge friendly!)
const model = google("gemini-2.5-pro-exp-03-25");

// set the runtime to edge
export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {

        // Define system prompt
        const prompt = `Create a list of three open-ended and engaging questions formatted as a single
        string. Each question should be separated by '||'. These questions are for an anonymous social
        messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal
        or sensitive topics, focusing instead on universal themes that encourage friendly interaction.
        For example, your output should be structured like this: "What's a hobby you have recently started? || 
        If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?"
        Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming 
        conversational environment.`;
        
        // Get messages from request body
        const { messages } = await request.json();
    
        // Use streamText with a configuration object and convert to proper response format
        const result = streamText({
            model,
            messages: messages as CoreMessage[],
            maxTokens: 500,
            system: prompt as string,
        });
    
    // Return a text stream response (no need for new Response wrapper)
    return NextResponse.json(result.toTextStreamResponse());
    } catch (error) {
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
