function ReflectionList({ history }) {
  if (!history) return null;

  return (
    <div className="reflections-container">
      <div className="reflections-header">
        <div>
          <span className="reflections-eyebrow">Archival Log</span>
          <h3 className="reflections-book-title">"{history.book.title}"</h3>
          {history.book.author && (
            <p className="reflections-book-author">by {history.book.author}</p>
          )}
        </div>
        <div className="total-reads-counter">
          <span className="total-reads-num">{history.total_reads}</span>
          <span className="total-reads-label">
            {history.total_reads === 1 ? "Read Completed" : "Reads Completed"}
          </span>
        </div>
      </div>

      <div className="reflections-divider" />

      {history.reflections.length === 0 ? (
        <div className="reflections-empty-state">
          <p className="loading-msg">No reflections recorded yet for this volume.</p>
        </div>
      ) : (
        <div className="reflections-list">
          {history.reflections.map((ref) => (
            <article key={ref._id} className="reflection-card">
              <div className="reflection-card-meta">
                <span className="read-number-text">Read #{ref.readNumber}</span>
                <span className="meta-separator" aria-hidden="true">·</span>
                <span
                  className="rating-stars"
                  aria-label={`Rating: ${ref.rating} out of 5 stars`}
                  title={`${ref.rating} / 5 stars`}
                >
                  {"★".repeat(ref.rating)}
                  {"☆".repeat(Math.max(0, 5 - ref.rating))}
                </span>
                {ref.mood && (
                  <>
                    <span className="meta-separator" aria-hidden="true">·</span>
                    <span className="reflection-mood">
                      Mood: <strong>{ref.mood}</strong>
                    </span>
                  </>
                )}
              </div>

              {ref.favoriteQuote && (
                <blockquote className="quote">
                  <span className="quote-mark" aria-hidden="true">“</span>
                  {ref.favoriteQuote}
                  <span className="quote-mark" aria-hidden="true">”</span>
                </blockquote>
              )}

              {ref.thoughts && (
                <div className="reflection-thoughts">
                  <p>{ref.thoughts}</p>
                </div>
              )}

              {ref.tags && ref.tags.length > 0 && (
                <div className="reflection-tags">
                  {ref.tags.map((tag, idx) => (
                    <span key={idx} className="reflection-tag-text">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReflectionList;
