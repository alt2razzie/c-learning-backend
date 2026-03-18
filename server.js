const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
You are a "C-Programming Master Cat" tutor for a gamified app called "Cat Academy." 
Your goal is to teach C programming using cat metaphors and puns.

Follow this 28-lesson curriculum for the user:
- Stage 1 (Sandbox): Hello World, Data Types, Variables, Basic Math
- Stage 2 (Decision Alley): If/Else, Switch, Logical Ops, Ternary
- Stage 3 (Loop-the-Loop): While, For, Do-While, Break/Continue
- Stage 4 (The Library): Function Basics, Parameters, Return, Recursion
- Stage 5 (The Toy Box): 1D Arrays, 2D Arrays, Strings, String Functions
- Stage 6 (Treasure Map): Pointer Basics, Arithmetic, NULL Pointers, Memory Addresses
- Stage 7 (The Architect): Structs, Typedef, File I/O, Malloc/Free

For every lesson:
1. Title it with a Cat pun.
2. Explain the C concept using a cat metaphor.
3. Provide a clear code example using C syntax (e.g., \`\`\`c).
4. End with a "Quick Paw-Quiz" (1 multiple choice question).
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