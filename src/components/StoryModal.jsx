import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeStory, nextStory, prevStory } from "../features/storiesSlice";

const AUTO_ADVANCE_MS = 5000; // 5 seconds

export default function StoryModal() {
  const dispatch = useDispatch();
  const { items, activeIndex } = useSelector((s) => s.stories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  // Guard

  //   load image and handle loading state
  const story =
    activeIndex !== null && items.length ? items[activeIndex] : null;

  useEffect(() => {
    if (!story) return;
    setLoading(true);
    setError(null);
    const img = new Image();
    img.src = story.image;
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setLoading(false);
      setError("Failed to load image");
    };
  }, [story]);

  // auto-advance timer
  useEffect(() => {
    if (!story) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (!loading) {
      timerRef.current = setInterval(() => {
        if (activeIndex >= items.length - 1) dispatch(closeStory());
        else dispatch(nextStory());
      }, AUTO_ADVANCE_MS);
    }
    return () => clearInterval(timerRef.current);
  }, [story, activeIndex, items.length, dispatch, loading]);

  // manual nav: left/right zones
  const handleTap = (e) => {
    // determine x position relative to viewport width
    const x = e.nativeEvent.clientX;
    const w = window.innerWidth;
    if (story && x < w / 2) {
      // left
      if (activeIndex > 0) dispatch(prevStory());
      else dispatch(closeStory());
    } else {
      // right
      if (activeIndex < items.length - 1) dispatch(nextStory());
      else dispatch(closeStory());
    }
  };

  // reset timer when user manually navigates
  const manualNav = (direction) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (direction === "next") {
      if (activeIndex < items.length - 1) dispatch(nextStory());
      else dispatch(closeStory());
    } else {
      if (activeIndex > 0) dispatch(prevStory());
      else dispatch(closeStory());
    }
  };

  if (!story) return null;

  return (
    <div className="story-modal" role="dialog" aria-label="Story viewer">
      <div className="story-top">
        <div className="story-user">{story.user}</div>
        <button
          className="close-btn"
          onClick={() => dispatch(closeStory())}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="story-progress">
        {items.map((it, i) => (
          <div className="progress-slot" key={it.id}>
            <div
              className={`progress-fill ${
                i < activeIndex
                  ? "done"
                  : i === activeIndex && !loading
                  ? "active"
                  : ""
              }`}
              style={
                i === activeIndex
                  ? { animationDuration: `${AUTO_ADVANCE_MS}ms` }
                  : {}
              }
            />
          </div>
        ))}
      </div>

      <div className="story-content" onClick={handleTap}>
        {loading && (
          <div className="spinner" aria-hidden="true">
            <div className="dot" style={{ background: "#000", color: "#fff" }}>
              Loading...
            </div>
          </div>
        )}
        {error && <div className="story-error">{error}</div>}
        {!loading && !error && (
          <img
            src={story.image}
            alt={`Story by ${story.user}`}
            className="story-image"
          />
        )}

        {/* Left/Right nav buttons for accessibility (visible but small) */}
        <button
          className="nav left"
          onClick={(e) => {
            e.stopPropagation();
            manualNav("prev");
          }}
          aria-label="Previous story"
        />
        <button
          className="nav right"
          onClick={(e) => {
            e.stopPropagation();
            manualNav("next");
          }}
          aria-label="Next story"
        />
      </div>
    </div>
  );
}
