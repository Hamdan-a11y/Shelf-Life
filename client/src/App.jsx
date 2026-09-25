import { useState, useEffect } from "react";
import "./App.css";
import BookCard from "./components/BookCard";
import ReflectionList from "./components/ReflectionList";
import AddReflectionForm from "./components/AddReflectionForm";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookHistory, setBookHistory] = useState(null);
  function handleReflectionAdded(savedReflection) {
  // Refresh the book's history so the new reflection and total_reads update immediately!
  handleSelectBook(savedReflection.book_id);
}
  useEffect(() => {
    fetch("http://localhost:3000/api/users/1/shelf")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shelf data");
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  

  function handleSelectBook(bookId) {
    fetch(`http://localhost:3000/api/users/1/shelf/${bookId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch book history");
        return res.json();
      })
      .then((data) => {
        setBookHistory(data);
      })
      .catch((err) => {
        console.error("Error fetching reflections:", err);
      });
  }

  return (
    <div className="header">
      <h1>ShelfLife</h1>
      <p>Welcome back, <strong>Alice</strong></p>

      <h2>My Shelf (Click a book to see your reflection history)</h2>

      {loading && <p className="loading-msg">Loading your shelf from MySQL...</p>}
      {error && <p className="error-msg">Error: {error}</p>}

      {!loading && !error && books.map((item) => (
        <BookCard
          key={item.shelf_entry_id}
          title={item.title}
          author={item.author}
          status={item.status}
          onClick={() => handleSelectBook(item.book_id)}
        />
      ))}

      {/* Renders the combined MongoDB reflections when a book is selected */}
      <ReflectionList history={bookHistory} />
      {bookHistory && (
  <AddReflectionForm
    bookId={bookHistory.book.book_id}
    nextReadNumber={bookHistory.total_reads + 1}
    onReflectionAdded={handleReflectionAdded}
  />
)}

    </div>
  );
}

export default App;
