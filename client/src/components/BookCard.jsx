function BookCard({ title, author, status, isSelected, onClick }) {
  const normalizedStatus = (status || "").toLowerCase().trim();

  return (
    <div
      className={`book-card clickable ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isSelected}
    >
      <div className="book-spine-indicator" aria-hidden="true" />
      <div className="book-card-main">
        <div className="book-card-top">
          <h3 className="book-title">{title}</h3>
          {status && (
            <span
              className={`book-status-tag status-${normalizedStatus.replace(
                /\s+/g,
                "-"
              )}`}
            >
              <span className="status-indicator-dot" aria-hidden="true" />
              {status}
            </span>
          )}
        </div>
        <p className="book-author">
          <span className="by-label">by</span> {author}
        </p>
      </div>
      <div className="book-card-arrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3.5L10.5 8L6 12.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default BookCard;