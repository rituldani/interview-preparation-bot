import axios from "axios"

export const QuestionGenerator = async(req, res) => {
    const { role } = req.body;
    console.log("Role:", role)

  try {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    const ollamaRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, {
      model: 'gemma:2b',
      prompt: `Ask 10 interview questions for a ${role} role. Include technical and behavioral.`,
      stream: false
    });

    const responseText = ollamaRes.data.response;
    const questions = responseText.split('\n').filter(q => q.trim() !== '');
    console.log(questions)

    res.json({ questions });
  } catch (err) {
    console.error('Ollama error:', err.message);
    res.status(500).json({ error: 'Failed to generate questions', detail: err.message });
  }
}