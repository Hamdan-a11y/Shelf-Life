function BookCard({ title, author, status, onClick }) {
  return (
    <div className="book-card clickable" onClick={onClick}>
      <h3>{title}</h3>
      <p>Author: {author}</p>
      <p className="book-status">Status: <em>{status}</em></p>
    </div>
  );
}

export default BookCard;