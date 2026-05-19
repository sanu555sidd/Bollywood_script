const BASE_URL = "/api/script";

async function request(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data.data;
}

export const api = {
  generateScript: (situation, mood) => request("/generate", { situation, mood }),

  regenerateScene: (situation, sceneIndex, existingScript, mood) =>
    request("/regenerate-scene", { situation, sceneIndex, existingScript, mood }),

  regenerateTitle: (situation, existingScript) =>
    request("/regenerate-title", { situation, existingScript }),
};
