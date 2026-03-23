import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from './data/products';

// Type for search result
interface SearchResult {
  id: string;
  title: string;
  price: number;
  image: string;
  type: string;
}

// Export a function to control visibility from outside
export let mobileSearchControl: {
  show: () => void;
  hide: () => void;
  toggle: () => void;
} | null = null;

export default function MobileSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose control functions
  useEffect(() => {
    mobileSearchControl = {
      show: () => setIsVisible(true),
      hide: () => { setIsVisible(false); setQuery(''); setResults([]); },
      toggle: () => setIsVisible(prev => !prev)
    };
    return () => { mobileSearchControl = null; };
  }, []);

  // Independent search - filters products without affecting other search systems
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = PRODUCTS.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.color.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Limit to 8 results
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  const handleResultClick = () => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  return (
    <div 
      className={`mobile-search-bar ${isVisible ? 'mobile-search-bar--visible' : 'hidden'}`} 
      ref={containerRef}
    >
      <div className="mobile-search-container">
        <Search className="mobile-search-icon" />
        
        <input
          type="text"
          className="mobile-search-input"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        
        {query && (
          <button 
            className="mobile-search-clear" 
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <div className={`mobile-search-results ${isFocused && results.length > 0 ? 'active' : ''}`}>
        {results.length > 0 ? (
          results.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="mobile-search-result-item"
              onClick={handleResultClick}
            >
              <img
                src={product.image || 'https://via.placeholder.com/40'}
                alt={product.title}
                className="mobile-search-result-image"
              />
              <div className="mobile-search-result-info">
                <div className="mobile-search-result-title">{product.title}</div>
                <div className="mobile-search-result-price">${product.price.toFixed(2)}</div>
              </div>
            </Link>
          ))
        ) : (
          <div className="mobile-search-no-results">
            {query && isFocused ? 'No products found' : 'Start typing to search'}
          </div>
        )}
      </div>
    </div>
  );
}
