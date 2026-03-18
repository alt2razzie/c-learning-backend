require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/get-lesson', async (req, res) => {
    try {
        const { topic } = req.body;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a funny C programming tutor. For every topic, provide:
                    1. A short lesson using cat metaphors.
                    2. A code block using \`\`\`c syntax.
                    3. A "Cat-tastic Trivia" section about C history.
                    4. A "Quick Paw-Quiz" with 1 multiple choice question.
                    5. The "Answer Key" at the very bottom hidden in a <details> tag.`
                },
                {
                    role: 'user',
                    content: `Teach me about ${topic}`
                }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        res.json({ lessonContent: chatCompletion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('🚀 C-Academy Server on Port 3000'));