import axios from "axios"

export const QuestionGenerator = async(req, res) => {
    const { role } = req.body;
    console.log("Role:", role)

  try {
    const ollamaRes = await axios.post('http://localhost:11434/api/generate', {
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