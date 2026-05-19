import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { api } from "./utils/api.js";
import { useHistory } from "./hooks/useHistory.js";
import { HistorySidebar } from "./components/HistorySidebar.jsx";
import { MovieHeader } from "./components/MovieHeader.jsx";
import { CharacterCards } from "./components/CharacterCards.jsx";
import { SceneCard } from "./components/SceneCard.jsx";

const MOODS = ["DRAMATIC", "INTENSE", "ROMANTIC", "COMEDIC", "TRAGIC", "ACTION"];

export default function App() {
  const [situation, setSituation] = useState("");
  const [mood, setMood] = useState("DRAMATIC");
  const [loading, setLoading] = useState(false);
  const [activeEntry, setActiveEntry] = useState(null);

  const { history, addEntry, updateEntry } = useHistory();

  async function handleGenerate() {
    if (!situation.trim() || situation.trim().length < 5) {
      toast.error("Please describe the situation (at least 5 characters).");
      return;
    }

    setLoading(true);
    try {
      const script = await api.generateScript(situation.trim(), mood);
      const entry = addEntry(situation.trim(), mood, script);
      setActiveEntry(entry);
      toast.success("🎬 Drama generated! Lights, camera, action!");
    } catch (err) {
      toast.error(err.message || "Failed to generate script. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHistory(entry) {
    setActiveEntry(entry);
    setSituation(entry.situation);
    setMood(entry.mood);
  }

  function handleScriptUpdate(updatedScript) {
    if (!activeEntry) return;
    const updated = { ...activeEntry, script: updatedScript };
    setActiveEntry(updated);
    updateEntry(activeEntry.id, updatedScript);
  }

  function handleSceneUpdate(sceneIndex, updatedScene) {
    if (!activeEntry) return;
    const updatedScenes = activeEntry.script.scenes.map((s) =>
      s.sceneIndex === sceneIndex ? updatedScene : s
    );
    const updatedScript = { ...activeEntry.script, scenes: updatedScenes };
    handleScriptUpdate(updatedScript);
  }

  const script = activeEntry?.script;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1c1218",
            color: "#f0e6d3",
            border: "1px solid #2e1e26",
          },
        }}
      />

      <div className="app-wrapper">
        {/* Header */}
        <header className="app-header">
          <div className="header-logo">
            🎬 DRAMA<span>MATIC</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#9a8070" }}>
            AI Bollywood Script Generator
          </div>
        </header>

        {/* Sidebar */}
        <HistorySidebar
          history={history}
          activeId={activeEntry?.id}
          onSelect={handleSelectHistory}
        />

        {/* Main */}
        <main className="main-content">
          {/* Input */}
          <section className="input-section">
            <h2>CREATE YOUR DRAMA</h2>
            <p>Describe any ordinary situation and watch it become an epic Bollywood blockbuster.</p>
            <div className="input-row">
              <textarea
                className="situation-input"
                placeholder="e.g. Fight between two founders over putting sugar in coffee..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                maxLength={500}
                rows={2}
              />
              <select
                className="mood-select"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "GENERATING..." : "LIGHTS, CAMERA!"}
              </button>
            </div>
          </section>

          {/* Loading */}
          {loading && (
            <div className="loading-overlay">
              <div className="loading-icon">🎭</div>
              <div className="loading-text">WRITING YOUR EPIC DRAMA...</div>
            </div>
          )}

          {/* Script Output */}
          {script && !loading && (
            <div className="script-output">
              <MovieHeader
                script={script}
                situation={activeEntry.situation}
                onUpdate={handleScriptUpdate}
              />

              <CharacterCards characters={script.characters} />

              <div className="scenes-section">
                <h3>THE SCENES</h3>
                {script.scenes?.map((scene) => (
                  <SceneCard
                    key={scene.sceneIndex}
                    scene={scene}
                    situation={activeEntry.situation}
                    script={script}
                    mood={activeEntry.mood}
                    onSceneUpdate={handleSceneUpdate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!script && !loading && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#9a8070" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎬</div>
              <div style={{ fontFamily: "var(--font-display)", letterSpacing: "3px", fontSize: "1.2rem", color: "#f5c518" }}>
                YOUR STAGE AWAITS
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Enter any situation above to generate your Bollywood blockbuster
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
