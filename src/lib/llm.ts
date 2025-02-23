import OpenAI from 'openai';

const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

export async function generateDotDiagram(code: string, prompt: string, apiKey: string) {
  try {
    const client = new OpenAI({ 
      baseURL: endpoint, 
      apiKey,
      dangerouslyAllowBrowser: true 
    });

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a specialized assistant that converts code into DOT diagram syntax. Always respond with valid DOT syntax only, no explanations or additional text."
        },
        {
          role: "user",
          content: `${prompt}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nRespond with DOT syntax only.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      model: modelName
    });

    console.log('LLM Response:', response);

    const content = response.choices[0].message.content;
    // Extract DOT syntax from code block if present
    const dotCode = content.match(/```dot\n([\s\S]*?)\n```/) 
      ? content.match(/```dot\n([\s\S]*?)\n```/)![1]
      : content.trim();

    if (!dotCode?.trim().startsWith('digraph') && !dotCode?.trim().startsWith('graph')) {
      throw new Error('Invalid DOT syntax received from LLM');
    }
    console.log("DOT definition:", dotCode);
    return { dotCode, rawResponse: response };
  } catch (error) {
    console.error('LLM Error:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      rawResponse: error
    };
  }
}