import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query.trim()) {
      setError("Please enter a book title");
      setBooks([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.docs.length === 0) {
        setError("No books found!");
      }

      setBooks(data.docs.slice(0, 12));
    } catch (err) {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📚 Book Finder</h1>

      {/* Search */}
      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          className="border p-2 w-64 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button
          onClick={searchBooks}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
              className="w-full h-60 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p className="text-sm text-gray-500">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
