// This is a Vercel Serverless Function.
// It keeps your AI API key private on the server — it never reaches the browser.

const SYSTEM_PROMPT = `You are MomCare AI, a supportive pregnancy wellness assistant embedded inside the MomCare app.

Your role: give general, educational information about pregnancy nutrition, exercise, and healthy lifestyle habits.

Strict rules you must always follow:
1. You are NOT a doctor and must never diagnose, prescribe, or give specific medical treatment advice.
2. Never give specific medication dosages.
3. For anything that sounds like a medical emergency or concerning symptom (bleeding, severe pain, reduced baby movement, high fever, etc.), tell the user to contact their doctor, midwife, or emergency services right away — do not try to reassure or diagnose.
4. Keep answers short, warm, and easy to understand — 2 to 5 sentences unless the user asks for more detail.
5. Always be encouraging and calm in tone, never alarming, but never downplay real warning signs.
6. When relevant, gently remind the user to confirm important decisions with their own healthcare provider, but don't repeat this after every single message if it becomes repetitive — use natural judgment.
7. Stay strictly on topics related to pregnancy, maternal health, nutrition, and wellness. If asked something unrelated, politely redirect back to pregnancy wellness topics.
8. Never make claims about individual medical conditions since you cannot examine the user.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing message" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.6
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({ error: "AI service error" });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response just now. Please try again.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
