import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ API key is not set in environment variables");
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export interface ExtractedData {
  rawResponse: string;
}

export async function extractDataWithGroq(text: string): Promise<ExtractedData> {
  const prompt = `Extract the following information from this invoice text:
  1. Customer details
  2. Product information
  3. Total amount

  Invoice text:
  ${text}

  Please provide the extracted information in a readable format.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.2,
    });

    const result = chatCompletion.choices[0]?.message?.content;
    console.log("Raw API response:", result);

    if (result) {
      return { rawResponse: result };
    } else {
      throw new Error("No content received from Groq API");
    }
  } catch (error) {
    console.error("Error extracting data with Groq:", error);
    throw new Error("Failed to extract data from the provided text.");
  }
}