function ReflectionList({ history }) {
  if (!history) return null;

  return (
    <div className="reflections-container">
      <h3>Reading History & Reflections for "{history.book.title}"</h3>
      <p className="total-reads">Total times read: {history.total_reads}</p>

      {history.reflections.length === 0 ? (
        <p className="loading-msg">No reflections recorded yet.</p>
      ) : (
        history.reflections.map((ref) => (
          <div key={ref._id} className="reflection-card">
            <h4>Read #{ref.readNumber} — Rating: {"⭐".repeat(ref.rating)}</h4>
            {ref.mood && <p><strong>Mood:</strong> {ref.mood}</p>}
            {ref.favoriteQuote && (
              <blockquote className="quote">"{ref.favoriteQuote}"</blockquote>
            )}
            {ref.thoughts && <p><strong>Thoughts:</strong> {ref.thoughts}</p>}
            {ref.tags && ref.tags.length > 0 && (
              <p><strong>Tags:</strong> {ref.tags.join(", ")}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ReflectionList;
