import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "bollywood_drama_history";
const MAX_HISTORY = 20;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.warn("Could not save history to localStorage.");
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  function addEntry(situation, mood, script) {
    const entry = {
      id: uuidv4(),
      situation,
      mood,
      script,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      return updated;
    });

    return entry;
  }

  function updateEntry(id, updatedScript) {
    setHistory((prev) =>
      prev.map((e) => (e.id === id ? { ...e, script: updatedScript } : e))
    );
  }

  function clearHistory() {
    setHistory([]);
  }

  return { history, addEntry, updateEntry, clearHistory };
}
