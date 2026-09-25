import { useState } from "react";

function AddReflectionForm({ bookId, onReflectionAdded, nextReadNumber }) {
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReflection)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save reflection");
        return res.json();
      })
      .then((savedReflection) => {
        // clear the form
        setMood("");
        setThoughts("");
        setIsSubmitting(false);
        // Notify parent to refresh reflections!
        onReflectionAdded(savedReflection);
      })
      .catch((err) => {
        console.error("Error saving reflection:", err);
        setIsSubmitting(false);
      });
  }

  return (
    <form className="reflection-form" onSubmit={handleSubmit}>
      <div className="reflection-form-header">
        <div>
          <h4>Log Read #{nextReadNumber || 1} Reflection</h4>
          <p className="reflection-form-subtext">Record your impressions, mood, and personal takeaways</p>
        </div>
      </div>

      <div className="reflection-inputs-grid">
        <div className="form-group rating-form-group">
          <label htmlFor="reflection-rating-input">
            Rating (1–5):
          </label>
          <div className="rating-interactive-row">
            <input
              id="reflection-rating-input"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rating-number-input"
              required
            />
            <div className="star-picker-buttons" role="group" aria-label="Select rating in stars">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  type="button"
                  key={starVal}
                  className={`star-pick-btn ${starVal <= Number(rating) ? "active" : ""}`}
                  onClick={() => setRating(starVal)}
                  title={`${starVal} Star${starVal > 1 ? "s" : ""}`}
                  aria-label={`${starVal} Star${starVal > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reflection-mood-input">Mood:</label>
          <input
            id="reflection-mood-input"
            type="text"
            placeholder="e.g. nostalgic, inspired, reflective"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="reflection-thoughts-input">Thoughts &amp; Impressions:</label>
        <textarea
          id="reflection-thoughts-input"
          rows={3}
          placeholder="How did this reading feel? What resonated with you this time?"
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Recording..." : "Save Reflection to MongoDB"}
      </button>
    </form>
  );
}

export default AddReflectionForm;