import axios from "axios";
export const Evaluation = async (req, res) => {
    console.log("reached?")
    const { question, answer } = req.body;

    console.log(question)
    console.log(answer)
    try {
        // http://192.168.236.204:11434
        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        const EvalResponse = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
            model: 'gemma:2b',
            prompt: `You are an HR expert. Evaluate the following candidate's answer.
                        Question: ${question}
                        Answer: ${answer}
                        Respond in this format only:
                            Score: x/10
                            Feedback: ...
                            Suggestion: ...`,
            stream: false
        });
        console.log(EvalResponse.data.response)
        const rawText = EvalResponse.data.response;

        // const scoreMatch = rawText.match(/\*\*Score:\*\*\s*(\d+)\/10/);
        // const feedbackSection = rawText.match(/\*\*Feedback:\*\*([\s\S]*?)\*\*Suggestion:\*\*/);
        // const suggestionSection = rawText.match(/\*\*Suggestion:\*\*([\s\S]*)/);

        const scoreMatch = rawText.match(/Score:\s*(\d+)\/10/i);
        const feedbackSection = rawText.match(/Feedback:\s*([\s\S]*?)Suggestion:/i);
        const suggestionSection = rawText.match(/Suggestion:\s*([\s\S]*)/i);


        const data = {
            score: scoreMatch ? parseInt(scoreMatch[1]) : null,
            feedback: feedbackSection
                ? feedbackSection[1].trim().split('\n').map(line => line.replace(/^\*\s*/, '')).join(' ')
                : '',
            suggestion: suggestionSection
                ? suggestionSection[1].trim().split('\n').map(line => line.replace(/^\*\s*/, '')).join(' ')
                : '',
        };
        console.log(data)
        res.json(data);
    }
    catch (error) {
        console.error("Error in generation:", error.message);
        res.status(500).json({ error: "Failed to evaluate answer." });
    }
}