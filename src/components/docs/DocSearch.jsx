// DocSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { docMenu, getCategorySlug } from './docMenu';
import './DocSearch.css';

export default function DocSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const newResults = [];

    // Search docMenu.js titles and categories
    docMenu.forEach(cat => {
      const catSlug = getCategorySlug(cat.category);
      cat.items.forEach(item => {
        if (
          item.title.toLowerCase().includes(lowerQuery) || 
          cat.category.toLowerCase().includes(lowerQuery) ||
          item.id.toLowerCase().includes(lowerQuery)
        ) {
          if (!item.disabled) {
            newResults.push({
              catTitle: cat.category,
              catSlug: catSlug,
              id: item.id,
              title: item.title
            });
          }
        }
      });
    });

    setResults(newResults);
    setIsOpen(true);
  }, [query]);

  return (
    <div className="doc-search-wrapper" ref={wrapperRef}>
      <input 
        type="text" 
        placeholder="Search Docs..." 
        className="doc-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
      />
      {isOpen && results.length > 0 && (
        <ul className="doc-search-dropdown">
          {results.map((res, i) => (
            <li key={i}>
              <Link 
                to={`/docs/${res.catSlug}/${res.id}`} 
                className="doc-search-link"
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <div className="doc-search-item-title">{res.title}</div>
                <div className="doc-search-item-cat">{res.catTitle}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {isOpen && query.trim() !== '' && results.length === 0 && (
        <div className="doc-search-dropdown empty">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}
