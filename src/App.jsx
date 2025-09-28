import React from "react";
import StoryList from "./components/StoryList";
import StoryModal from "./components/StoryModal";

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Stories (Mobile UI)</h1>
      </header>

      <main className="app-main">
        <p className="hint">
          Tap a thumbnail to open. Tap left/right side of story to navigate.
          Auto-advances every 5s.
        </p>
        <StoryList />
      </main>

      <StoryModal />

      <footer className="app-footer">
        <small>Mobile-only demo — built with React + Redux Toolkit</small>
      </footer>
    </div>
  );
}
