import React from "react";

const EMOJIS = ["🦁", "🐯", "🦅", "🌹", "⚡", "🔥", "🌊", "💎", "🗡️", "🕊️"];

export function CharacterCards({ characters }) {
  if (!characters?.length) return null;

  return (
    <div className="characters-section">
      <h3>CAST OF CHARACTERS !</h3>
      <div className="characters-grid">
        {characters.map((char, i) => (
          <div key={i} className="character-card">
            <div className="character-avatar">{EMOJIS[i % EMOJIS.length]}</div>
            <div className="character-name">{char.name}</div>
            <div className="character-role">{char.role}</div>
            <div className="character-desc">{char.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
