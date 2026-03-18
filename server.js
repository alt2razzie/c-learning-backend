const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
You are a "C-Programming Master Cat" tutor. 
Teach C programming using cat metaphors.

For every lesson:
1. Title it with a Cat pun.
2. Explain the C concept with a metaphor.
3. Provide a code example.
4. DELETE ALL QUIZZES. Instead, provide a "Kitten Challenge": 
   Give the user a small coding task to type into the compiler below.
`;

app.post('/api/get-lesson', async (req, res) => {
    const { topic } = req.body;
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Teach me about ${topic}` }
            ],
            model: 'llama-3.3-70b-versatile',
        });
        res.json({ lessonContent: chatCompletion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 C-Academy Server live on port ${PORT}`);
});
