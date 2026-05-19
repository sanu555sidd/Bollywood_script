import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

function getClient() {
  const routerKey = process.env.OPENROUTER_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const apiKey = routerKey || openaiKey;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY or OPENAI_API_KEY is missing in your .env file.\n" +
        "Add OPENROUTER_API_KEY=<your openrouter key> or OPENAI_API_KEY=<your openai key> to continue."
    );
  }

  const clientOptions = { apiKey };

  // If using OpenRouter, point the client to the OpenRouter base URL and add headers
  if (routerKey) {
    clientOptions.baseURL = "https://openrouter.ai/api/v1";
    clientOptions.defaultHeaders = {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Bollywood Drama Generator",
    };
  }

  return new OpenAI(clientOptions);
}

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `You are the world's most dramatic Bollywood/Hollywood script writer. 
Your job is to take ordinary real-world situations and transform them into over-the-top, 
cinematic Bollywood drama with:
- Thunderclap sound effects (described in scene)
- Slow-motion reveals
- Dramatic background music cues
- Emotional monologues
- Unexpected plot twists
- Dance numbers if fitting
- Family drama and honor/betrayal themes
- Rain scenes for emotional moments

Always respond with ONLY valid JSON matching the exact schema requested. No extra text.`;

const SCRIPT_SCHEMA = `{
  "movieTitle": "string - dramatic Hindi/English movie title",
  "tagline": "string - dramatic one-liner tagline",
  "genre": "string - e.g. Action-Drama, Romantic-Thriller",
  "characters": [
    {
      "name": "string",
      "role": "string - e.g. protagonist, antagonist, comic relief",
      "description": "string - 1-2 sentence dramatic character description"
    }
  ],
  "scenes": [
    {
      "sceneIndex": number,
      "sceneTitle": "string",
      "mood": "string - e.g. INTENSE, ROMANTIC, COMEDIC, TRAGIC",
      "description": "string - vivid scene description with camera directions, sound effects, atmosphere",
      "dialogue": [
        {
          "character": "string - character name",
          "line": "string - dramatic dialogue line"
        }
      ]
    }
  ]
}`;

export async function generateScript(situation, mood = "DRAMATIC") {
  const userPrompt = `Transform this situation into a full Bollywood movie script:

SITUATION: "${situation}"
MOOD: ${mood}

Requirements:
- Generate a movie title, tagline, genre
- Create 3-5 named characters with roles and descriptions  
- Write 4-6 scenes minimum
- Each scene must have: sceneTitle, mood, vivid description, and at least 3 dialogue lines
- Make it EXTREMELY dramatic and over-the-top
- Include dramatic Bollywood tropes (slow motion, thunderclaps, rain, betrayal, etc.)

Respond with ONLY this JSON schema (no markdown, no extra text):
${SCRIPT_SCHEMA}`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.9,
    max_tokens: 3000,
  });

  const rawContent = response.choices[0]?.message?.content;
  if (!rawContent) throw new Error("No content returned from AI model");

  const cleaned = rawContent
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  validateScriptOutput(parsed);
  return parsed;
}

export async function regenerateScene(situation, sceneIndex, existingScript, mood = "DRAMATIC") {
  const userPrompt = `Regenerate ONLY scene number ${sceneIndex} for this Bollywood script.

ORIGINAL SITUATION: "${situation}"
MOOD: ${mood}
MOVIE TITLE: "${existingScript.movieTitle}"

Make it different and MORE dramatic than before.

Respond with ONLY this JSON (no markdown, no extra text):
{
  "sceneIndex": ${sceneIndex},
  "sceneTitle": "string",
  "mood": "string",
  "description": "string - vivid scene description",
  "dialogue": [{"character": "string", "line": "string"}]
}`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 1.0,
    max_tokens: 1000,
  });

  const rawContent = response.choices[0]?.message?.content;
  if (!rawContent) throw new Error("No content returned from AI model");

  const cleaned = rawContent
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON for scene regeneration.");
  }
}

export async function regenerateTitle(situation, existingScript) {
  const userPrompt = `Generate a new, MORE dramatic movie title and tagline for this Bollywood script.

SITUATION: "${situation}"
CURRENT TITLE: "${existingScript.movieTitle}"
GENRE: "${existingScript.genre}"

Make it completely different and even more dramatic.

Respond with ONLY this JSON:
{"movieTitle": "string", "tagline": "string"}`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 1.0,
    max_tokens: 200,
  });

  const rawContent = response.choices[0]?.message?.content;
  if (!rawContent) throw new Error("No content returned from AI model");

  const cleaned = rawContent
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON for title regeneration.");
  }
}

function validateScriptOutput(data) {
  const required = ["movieTitle", "tagline", "characters", "scenes"];
  for (const field of required) {
    if (!data[field]) throw new Error(`Missing required field: ${field}`);
  }
  if (!Array.isArray(data.scenes) || data.scenes.length === 0) {
    throw new Error("Script must have at least one scene");
  }
  if (!Array.isArray(data.characters) || data.characters.length === 0) {
    throw new Error("Script must have at least one character");
  }
}