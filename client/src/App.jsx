import { useState, useEffect } from "react";
import "./App.css";
import BookCard from "./components/BookCard";
import ReflectionList from "./components/ReflectionList";
import AddReflectionForm from "./components/AddReflectionForm";
import AddBookForm from "./components/AddBookForm";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookHistory, setBookHistory] = useState(null);

  function handleReflectionAdded(savedReflection) {
    // Refresh the book's history so the new reflection and total_reads update immediately!
    handleSelectBook(savedReflection.book_id);
  }

  function handleBookAdded(savedBook) {
    setBooks((prevBooks) => [...prevBooks, savedBook]);
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
    <div className="shelf-app">
      {/* Full-width Top Masthead */}
      <header className="app-masthead">
        <div className="masthead-inner">
          <div className="brand-group">
            <div className="brand-symbol" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="brand-title">Shelf Life</h1>
              <p className="brand-tagline">Personal Reading Archive &amp; Reflections</p>
            </div>
          </div>

          <div className="user-profile-meta">
            <span className="user-avatar" aria-hidden="true">A</span>
            <div className="user-details">
              <span className="user-greeting">Welcome back, <strong>Alice</strong></span>
              <span className="shelf-counter">
                {books.length} {books.length === 1 ? "volume" : "volumes"} on shelf
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace - fills screen and balanced */}
      <main className="app-main-layout">
        {/* Left Column: Catalog & Shelf */}
        <section className="shelf-column" aria-label="Bookshelf and catalog">
          <AddBookForm onBookAdded={handleBookAdded} />

          <div className="shelf-header-group">
            <h2>My Shelf</h2>
            <p className="shelf-subtitle">Click a book to see your reflection history</p>
          </div>

          {loading && (
            <div className="state-notice loading-notice">
              <div className="spinner-indicator" aria-hidden="true" />
              <p className="loading-msg">Loading your shelf from MySQL...</p>
            </div>
          )}

          {error && (
            <div className="state-notice error-notice">
              <span className="error-icon" aria-hidden="true">⚠</span>
              <p className="error-msg">Error: {error}</p>
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="state-notice empty-shelf-notice">
              <p>Your shelf is empty. Add your first book above to begin logging reflections.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="books-list" role="list">
              {books.map((item) => (
                <BookCard
                  key={item.shelf_entry_id}
                  title={item.title}
                  author={item.author}
                  status={item.status}
                  isSelected={bookHistory?.book?.book_id === item.book_id}
                  onClick={() => handleSelectBook(item.book_id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Reflections Timeline & Log Form */}
        <section className="reflections-column" aria-label="Book reflections panel">
          {bookHistory ? (
            <div className="active-reflection-pane">
              <ReflectionList history={bookHistory} />
              <AddReflectionForm
                bookId={bookHistory.book.book_id}
                nextReadNumber={bookHistory.total_reads + 1}
                onReflectionAdded={handleReflectionAdded}
              />
            </div>
          ) : (
            <div className="reflection-placeholder-card">
              <div className="placeholder-icon-wrap" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Select a book from your shelf</h3>
              <p>
                Click any title on the left to explore your reading timeline, re-read count, favorite quotes, and capture fresh thoughts.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
