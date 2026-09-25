const express = require("express");
const app = express();
const pool = require("./db");
const connectMongoDB = require("./mongo");
connectMongoDB();
const Reflection = require("./models/Reflection");

app.use(express.json());
const cors = require("cors");
app.use(cors());

const PORT = 3000;

// 1. Get ALL books from MySQL
app.get("/api/books", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books");
    res.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// 2. Get ONE book by ID from MySQL
app.get("/api/books/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found on shelf" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// 3. Add a NEW book to MySQL
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, isbn } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)",
      [title, author, isbn || null]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      author,
      isbn: isbn || null
    });
  } catch (error) {
    console.error("Failed to insert book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
});

// 5. Update a book by ID in MySQL
app.put("/api/books/:id", async (req, res) => {
  try {
    const { title, author, isbn } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error:"Title and author are required" });
    }
    const [result] = await pool.query(
      "UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?",
      [title, author, isbn || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found to update"});
    }

    res.json({
      id: parseInt(req.params.id),
      title,
      author,
      isbn: isbn || null
    });
  } catch (error) {
    console.error("Failed to update book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});
// 4. Delete a book by ID from MySQL
app.delete("/api/books/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found to delete" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Failed to delete book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});
// 6. Get a user's shelf (with book details via SQL JOIN)
app.get("/api/users/:id/shelf", async (req, res) => {
  try {
    const query = `
      SELECT 
        shelves.id AS shelf_entry_id,
        shelves.status,
        shelves.date_added,
        books.id AS book_id,
        books.title,
        books.author,
        books.isbn
      FROM shelves
      INNER JOIN books ON shelves.book_id = books.id
      WHERE shelves.user_id = ?
    `;

    const [rows] = await pool.query(query, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch user shelf:", error);
    res.status(500).json({ error: "Failed to fetch user shelf" });
  }
});
//7. Add a new reflection (diary entry) to MongoDB
app.post("/api/reflections", async (req, res) => {
  try {
    const reflection = await
  Reflection.create(req.body);
    res.status(201).json(reflection);  
  } catch (error) {
    console.error("Failed to create reflection:", error);
    res.status(400).json({ error: error.message });
  }
});
// 8. Get all reflections for a specific book from MongoDB
app.get("/api/reflections/book/:bookId", async (req, res) => {
  try {
    const reflections = await Reflection.find({ book_id: req.params.bookId }).sort({ readNumber: 1 });
    res.json(reflections);
  } catch (error) {
    console.error("Failed to fetch reflections:", error);
    res.status(500).json({ error: "Failed to fetch reflections" });
  }
});
// 9. COMBINED ENDPOINT: MySQL (Book & Shelf) + MongoDB (Reflections)
app.get("/api/users/:userId/shelf/:bookId", async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    // 1. Fetch from MySQL
    const mysqlQuery = `
      SELECT 
        shelves.id AS shelf_entry_id,
        shelves.status,
        shelves.date_added,
        books.id AS book_id,
        books.title,
        books.author,
        books.isbn
      FROM shelves
      INNER JOIN books ON shelves.book_id = books.id
      WHERE shelves.user_id = ? AND books.id = ?
    `;

    const [rows] = await pool.query(mysqlQuery, [userId, bookId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found on this user's shelf" });
    }

    // 2. Fetch from MongoDB
    const reflections = await Reflection.find({ user_id: userId, book_id: bookId }).sort({ readNumber: 1 });

    // 3. Combine both into one response!
    res.json({
      book: rows[0],
      total_reads: reflections.length,
      reflections: reflections
    });
  } catch (error) {
    console.error("Failed to fetch combined book details:", error);
    res.status(500).json({ error: "Failed to fetch book details" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`ShelfLife server is running on http://localhost:${PORT}`);
});
