import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_weather",
        description: "Get the current weather for a location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "the city name",
            },
          },
          required: ["location"],
        },
      },
    ],
  },
];

async function get_weather(location: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `the weather in ${location} is sunny with a temperature of 75 degrees`;
}

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Start chat with tools from the beginning
    const chat = model.startChat({
      tools: tools,
    });

    // Send the initial message
    const chatResult = await chat.sendMessage(message);
    const response = chatResult.response;

    // Check for function calls
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const toolResults = [];

      for (const functionCall of functionCalls) {
        const { name, args } = functionCall;

        let result;

        if (name === "get_weather") {
          result = await get_weather((args as { location: string }).location);
        } else {
          result = "unknown function";
        }

        // Format the tool result properly for Gemini
        toolResults.push({
          functionResponse: {
            name: name,
            response: {
              content: result,
            },
          },
        });
      }

      // Send the function results back to the model
      const finalResult = await chat.sendMessage(toolResults);
      const finalText = finalResult.response.text();
      return NextResponse.json({ text: finalText });
    }

    // If no function calls, return the direct response
    const text = response.text();
    return NextResponse.json({ text });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}