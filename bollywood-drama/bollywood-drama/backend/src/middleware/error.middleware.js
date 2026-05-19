export function errorHandler(err, _req, res, _next) {
  console.error("❌ Error:", err.message);

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err.message?.includes("API key")) {
    return res.status(401).json({ error: "Invalid API key. Check your OpenRouter configuration." });
  }

  if (err.message?.includes("invalid JSON")) {
    return res.status(502).json({ error: err.message });
  }

  return res.status(500).json({
    error: err.message || "Internal server error. Please try again.",
  });
}
