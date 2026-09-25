import { useState } from "react";

function AddBookForm({ onBookAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author) {
      alert("Please provide both title and author");
      return;
    }

    const newBook = {
      title: title,
      author: author,
      isbn: isbn || null
    };

    fetch("http://localhost:3000/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add book");
        return res.json();
      })
      .then((savedBook) => {
        // Clear the form inputs
        setTitle("");
        setAuthor("");
        setIsbn("");
        // Notify parent component!
        onBookAdded(savedBook);
      })
      .catch((err) => console.error("Error adding book:", err));
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <h3>+ Add a New Book to the Catalog</h3>

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          placeholder="e.g. The Great Gatsby"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Author *</label>
        <input
          type="text"
          placeholder="e.g. F. Scott Fitzgerald"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>ISBN (optional)</label>
        <input
          type="text"
          placeholder="e.g. 978-0743273565"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
      </div>

      <button type="submit">Add Book to MySQL</button>
    </form>
  );
}

export default AddBookForm;
