import React, { useState } from 'react';

const SearchBar = ({ allCourses, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) { // Start suggesting after 2 characters
      const normalize = (str) => str.replace(/\s+/g, '').toUpperCase();
      const normalizedValue = normalize(value);
      const filtered = allCourses
        .filter(course => normalize(course).includes(normalizedValue))
        .slice(0, 10); // LIMIT to 10 for performance
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (course) => {
    setQuery(course);
    setSuggestions([]);
    onSearch(course);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-10">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search all SFU courses..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
          value={query}
          onChange={handleChange}
        />
      </div>

      {/* Suggestion Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-xl overflow-hidden">
          {suggestions.map((course, index) => (
            <li 
              key={index}
              className="p-3 hover:bg-red-50 cursor-pointer border-b last:border-none transition-colors"
              onClick={() => handleSelect(course)}
            >
              <span className="font-medium">{course}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;