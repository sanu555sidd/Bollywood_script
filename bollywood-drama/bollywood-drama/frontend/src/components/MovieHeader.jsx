import React, { useState } from "react";
import { api } from "../utils/api.js";
import toast from "react-hot-toast";

export function MovieHeader({ script, situation, onUpdate }) {
  const [loading, setLoading] = useState(false);

  async function handleRegenTitle() {
    setLoading(true);
    try {
      const data = await api.regenerateTitle(situation, script);
      onUpdate({ ...script, movieTitle: data.movieTitle, tagline: data.tagline });
      toast.success("Title regenerated! 🎬");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="movie-header">
      <div className="movie-genre">{script.genre || "Drama"}</div>
      <h1 className="movie-title">{script.movieTitle}</h1>
      <p className="movie-tagline">"{script.tagline}"</p>
      <div>
        <button
          className="regen-title-btn"
          onClick={handleRegenTitle}
          disabled={loading}
        >
          {loading ? "Regenerating..." : "↻ New Title"}
        </button>
      </div>
    </div>
  );
}
