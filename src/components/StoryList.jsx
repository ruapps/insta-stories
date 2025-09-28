import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, openStory } from "../features/storiesSlice";

export default function StoryList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.stories);

  useEffect(() => {
    if (status === "idle") dispatch(fetchStories());
  }, [status, dispatch]);

  if (status === "loading") {
    return <div className="story-list-loading">Loading stories...</div>;
  }

  if (status === "failed") {
    return (
      <div className="story-list-error">Error loading stories: {error}</div>
    );
  }

  return (
    <div className="story-list" role="list">
      {items.map((s, idx) => (
        <button
          key={s.id}
          className="story-thumb"
          onClick={() => dispatch(openStory(idx))}
          aria-label={`Open story by ${s.user}`}
        >
          <img src={s.image} alt={`Story by ${s.user}`} loading="lazy" />
          <div className="story-username">{s.user}</div>
        </button>
      ))}
    </div>
  );
}
