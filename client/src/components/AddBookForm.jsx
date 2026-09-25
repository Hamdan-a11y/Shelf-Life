import { useState } from "react";

function AddBookForm({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author) {
      alert("Please provide both title and author");
      return;
    }

    setIsSubmitting(true);
    const newBook = {
      title: title,
      author: author,
      isbn: isbn || null
    };

    fetch("http://localhost:3000/api/users/1/shelf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add book");
        return res.json();
      })
      .then((savedBook) => {
        setTitle("");
        setAuthor("");
        setIsbn("");
        setIsSubmitting(false);
        onBookAdded(savedBook);
      })
      .catch((err) => {
        console.error("Error adding book:", err);
        setIsSubmitting(false);
      });
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h3>Add a New Book to the Catalog</h3>
          <p className="form-subtitle">Expand your shelf with a new edition</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group form-group-full">
          <label htmlFor="book-title-input">
            Title <span className="required-star">*</span>
          </label>
          <input
            id="book-title-input"
            type="text"
            placeholder="e.g. The Great Gatsby"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="book-author-input">
              Author <span className="required-star">*</span>
            </label>
            <input
              id="book-author-input"
              type="text"
              placeholder="e.g. F. Scott Fitzgerald"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-isbn-input">
              ISBN <span className="optional-tag">(optional)</span>
            </label>
            <input
              id="book-isbn-input"
              type="text"
              placeholder="e.g. 978-0743273565"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Adding to Catalog..." : "Add Book to MySQL"}
        </button>
      </div>
    </form>
  );
}

export default AddBookForm;
