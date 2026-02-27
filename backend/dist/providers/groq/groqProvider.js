const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
export class GroqProvider {
    apiKey;
    model;
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.model = model;
    }
    async chatCompletion(req) {
        const res = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.model,
                messages: req.messages,
                temperature: req.temperature,
                max_tokens: req.max_tokens
            }),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Groq HTTP ${res.status}: ${text}`.slice(0, 4000));
        }
        const data = (await res.json());
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim()) {
            throw new Error('Groq response sin contenido.');
        }
        return { content };
    }
}
//# sourceMappingURL=groqProvider.js.map