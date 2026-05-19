import { Router } from "express";
import { generateScript, regenerateScene, regenerateTitle } from "../agents/scriptAgent.js";

export const scriptRouter = Router();

// POST /api/script/generate
scriptRouter.post("/generate", async (req, res, next) => {
  try {
    const { situation, mood } = req.body;

    if (!situation || typeof situation !== "string" || situation.trim().length < 5) {
      return res.status(400).json({
        error: "Please provide a valid situation (at least 5 characters).",
      });
    }

    if (situation.trim().length > 500) {
      return res.status(400).json({
        error: "Situation must be under 500 characters.",
      });
    }

    const script = await generateScript(situation.trim(), mood);

    return res.status(200).json({ success: true, data: script });
  } catch (err) {
    next(err);
  }
});

// POST /api/script/regenerate-scene
scriptRouter.post("/regenerate-scene", async (req, res, next) => {
  try {
    const { situation, sceneIndex, existingScript, mood } = req.body;

    if (!situation || !sceneIndex || !existingScript) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const scene = await regenerateScene(situation, sceneIndex, existingScript, mood);
    return res.status(200).json({ success: true, data: scene });
  } catch (err) {
    next(err);
  }
});

// POST /api/script/regenerate-title
scriptRouter.post("/regenerate-title", async (req, res, next) => {
  try {
    const { situation, existingScript } = req.body;

    if (!situation || !existingScript) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const titleData = await regenerateTitle(situation, existingScript);
    return res.status(200).json({ success: true, data: titleData });
  } catch (err) {
    next(err);
  }
});
