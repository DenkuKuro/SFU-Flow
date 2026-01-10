import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Normalize to uppercase for your backend (e.g., cmpt225 -> CMPT225)
      onSearch(query.toUpperCase().replace(/\s+/g, '')); 
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex gap-2 w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search course (e.g. CMPT 120)"
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;