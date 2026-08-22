const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL = "gemma3:latest";

async function askOllama(prompt) {
    try {
        const response = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama returned HTTP ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            response: data.response
        };

    } catch (error) {
        console.error("Ollama connection error:", error.message);

        return {
            success: false,
            error: "Ollama is not running or cannot be reached."
        };
    }
}

module.exports = {
    askOllama
};