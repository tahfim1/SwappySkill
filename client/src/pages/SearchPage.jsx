// src/pages/SearchPage.jsx
import { useState } from "react";
import axios from "axios";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchSkills = async (e) => {
    e?.preventDefault();
    setHasSearched(true);
    setLoading(true);
    setError("");

    try {
      const params = query.trim() ? { q: query.trim() } : {};
      const res = await axios.get("http://localhost:5000/api/search", { params });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setResults([]);
      setError("No results found or server error");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setError("");
    setHasSearched(false);
  };

  return (
    <div className="page-container">
      <h2>🔍 Search Skills</h2>

      <form onSubmit={searchSkills} className="search-form">
        <input
          type="text"
          placeholder="Enter skill keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        <div className="button-group">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Searching…" : "Search"}
          </button>
          <button type="button" onClick={clearSearch} className="btn-secondary">
            Clear
          </button>
        </div>
      </form>

      {error && <p className="error-text">{error}</p>}

      <ul className="results-list">
        {results.map((skill) => (
          <li key={skill._id} className="result-card">
            <strong>{skill.title ?? "Untitled"}</strong>
            {skill.description && <p>{skill.description}</p>}
          </li>
        ))}
        {!loading && hasSearched && results.length === 0 && !error && (
          <li className="no-result">No results found</li>
        )}
      </ul>
    </div>
  );
}

export default SearchPage;
