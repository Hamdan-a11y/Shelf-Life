import { useState } from "react";

function AddReflectionForm({ bookId, onReflectionAdded, nextReadNumber,
 }) {
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState("");
  const [thoughts, setThoughts] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); //Prevents the browser from reloading the page

    const newReflection = {
      book_id: bookId,
      user_id: 1,
      readNumber: nextReadNumber || 1,
      rating: Number(rating),
      mood: mood,
      thoughts: thoughts
    };

    fetch("http://localhost:3000/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json "},
      body: JSON.stringify(newReflection)
    })
    .then((res) => {
      if(!res.ok) throw new Error("Failed to save reflection");
      return res.json();
    })
    .then((savedReflection) => {
      //clear the form
      setMood("");
      setThoughts("");
      //Notify parent to refresh reflections!
      onReflectionAdded(savedReflection);
    })
    .catch((err) => console.error("Error saving reflection:", err))
  }

  return (
    <form className="reflection-form" onSubmit={handleSubmit}>
      <h4>Log a New Reflection / Re-read</h4>

      <label>
        Rating (1-5):
        <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        />
      </label>
      <label>
        Mood:
        <input
          type="text"
          placeholder="e.g. nostalgic, inspired, gloomy"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
      </label>
      <label>
        Thoughts:
        <textarea
          placeholder="How did this reading feel?"
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
        />
      </label>
      <button type="submit">Save Reflection to MongoDB</button>
    </form>
  );
}

export default AddReflectionForm;