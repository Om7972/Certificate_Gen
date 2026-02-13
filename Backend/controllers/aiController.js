// @desc    Generate Certificate Description using AI
// @route   POST /api/ai/generate-description
// @access  Private
const generateContent = async (req, res) => {
    try {
        const { eventName, achievementLevel, tone } = req.body;

        if (!eventName || !achievementLevel || !tone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const prompt = `Write a ${tone} certificate description (1-2 sentences) for a ${achievementLevel} achievement in ${eventName}. The text should be suitable for a professional certificate body text. Do not include quotes.`;

        // Define messages
        const messages = [
            { role: "system", content: "You are a professional copywriter for formal certificates." },
            { role: "user", content: prompt }
        ];

        // Check for OPENAI_API_KEY
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY not configured');
        }

        // Use global fetch (Node 18+)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 100,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content.trim();

        res.status(200).json({ description: generatedText });

    } catch (error) {
        console.error('AI Generation Error:', error.message);

        // Return fallback description if AI fails (e.g., no key or rate limit)
        // This ensures the user still gets something usable
        let fallbackText = `In recognition of outstanding performance and dedication in ${eventName}. Your commitment to excellence has been exemplary.`;

        if (achievementLevel.toLowerCase().includes('participat')) {
            fallbackText = `For successfully participating in ${eventName}. We appreciate your enthusiastic involvement.`;
        }

        res.status(200).json({
            description: fallbackText,
            warning: 'AI service unavailable (Check Server Logs/API Key), used template text.',
            error: error.message
        });
    }
};

module.exports = { generateContent };
