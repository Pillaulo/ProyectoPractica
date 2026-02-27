const axios = require("axios");

class GroqProvider {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: "https://api.groq.com/openai/v1",
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async generateStory(prompt) {
    const response = await this.client.post("/chat/completions", {
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que genera cuentos para ninos y SIEMPRE responde JSON estricto.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response?.data?.choices?.[0]?.message?.content || "";
  }
}

module.exports = {
  GroqProvider,
};
