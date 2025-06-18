import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  Tool,
  SchemaType,
  FunctionCall,
} from "@google/generative-ai";

// Mock weather function implementation
const getWeather = ({ city }: { city: string }): string => {
  return `The current weather in ${city} is sunny with a temperature of 25 degrees Celsius.`;
};

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "getWeather",
        description:
          "Get the current weather for a specified city (mock implementation)",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            city: {
              type: SchemaType.STRING,
              description: "The name of the city to get the weather for",
            },
          },
          required: ["city"],
        },
      },
    ],
  },
];

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: tools,
    });
    const result = await model.generateContent(message);

    const response = await result.response;
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0] as FunctionCall;

      if (functionCall.name === "getWeather") {
        const { city } = functionCall.args as { city: string };
        const weatherResult = getWeather({ city });

        const followUpResult = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Here's the weather information: ${weatherResult}`,
                },
              ],
            },
          ],
          tools: [
            {
              functionDeclarations: [
                {
                  name: "getWeather",
                  description:
                    "Get the current weather for a specified city (mock implementation)",
                  parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                      city: {
                        type: SchemaType.STRING,
                        description:
                          "The name of the city to get the weather for",
                      },
                    },
                    required: ["city"],
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
          },
        });

        const finalText = await followUpResult.response.text();

        return NextResponse.json({ text: finalText });
      }
    }

    const text = await result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
