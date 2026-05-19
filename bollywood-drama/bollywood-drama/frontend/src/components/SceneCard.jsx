import React, { useState } from "react";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

export function SceneCard({ scene, situation, script, mood, onSceneUpdate }) {
  const [loading, setLoading] = useState(false);
  const [currentScene, setCurrentScene] = useState(scene);

  async function handleRegenScene() {
    setLoading(true);
    try {
      const newScene = await api.regenerateScene(
        situation,
        scene.sceneIndex,
        script,
        mood
      );
      const updated = { ...currentScene, ...newScene };
      setCurrentScene(updated);
      onSceneUpdate(scene.sceneIndex, updated);
      toast.success(`Scene ${scene.sceneIndex} regenerated! 🎭`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const moodClass = `mood-${(currentScene.mood || "DRAMATIC").toUpperCase().split(" ")[0]}`;

  return (
    <div className="scene-card">
      <div className="scene-header">
        <div className="scene-index-badge">SCENE {currentScene.sceneIndex}</div>
        <div className="scene-title-text">{currentScene.sceneTitle}</div>
        <div className={`scene-mood-badge ${moodClass}`}>{currentScene.mood}</div>
        <button
          className="regen-scene-btn"
          onClick={handleRegenScene}
          disabled={loading}
        >
          {loading ? "..." : "↻ Redo"}
        </button>
      </div>

      <div className="scene-body">
        <p className="scene-description">{currentScene.description}</p>
        <div className="dialogue-list">
          {currentScene.dialogue?.map((d, i) => (
            <div key={i} className="dialogue-line">
              <div className="dialogue-character">{d.character}</div>
              <div className="dialogue-text">"{d.line}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
