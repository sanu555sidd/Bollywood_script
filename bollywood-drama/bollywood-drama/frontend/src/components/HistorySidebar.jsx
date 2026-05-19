import React from "react";

export function HistorySidebar({ history, activeId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">PAST DRAMAS</div>
      {history.length === 0 ? (
        <div className="history-empty">No dramas yet.<br />Generate your first!</div>
      ) : (
        history.map((entry) => (
          <button
            key={entry.id}
            className={`history-item ${entry.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(entry)}
          >
            <div className="history-item-title">{entry.script.movieTitle}</div>
            <div className="history-item-situation">{entry.situation}</div>
          </button>
        ))
      )}
    </aside>
  );
}
