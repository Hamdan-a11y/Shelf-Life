const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json());

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

// Start the server
app.listen(PORT, () => {
  console.log(`ShelfLife server is running on http://localhost:${PORT}`);
});
