import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Search, LayoutGrid, List, Heart, Star, ChevronUp, ChevronDown, ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { PRODUCTS } from './data/products';

const BRANDS = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo'];
const FEATURES = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];
const CONDITIONS = ['Any', 'Refurbished', 'Brand new', 'Old items'];
const RATINGS = [5, 4, 3, 2];

export default function PLP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(urlSearchQuery);

  // Update input if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearchQuery);
  }, [urlSearchQuery]);

  // Sync URL search param with input (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearchQuery) {
        const newParams = new URLSearchParams(searchParams);
        if (searchInput) {
          newParams.set('search', searchInput);
        } else {
          newParams.delete('search');
        }
        setSearchParams(newParams, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearchQuery, searchParams, setSearchParams]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Accordion state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Category: true,
    Brands: true,
    Features: true,
    Price: true,
    Condition: true,
    Ratings: true,
    Manufacturer: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    Brands: [],
    Features: [],
    Condition: ['Any'],
    Ratings: [],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [tempPrice, setTempPrice] = useState({ min: '', max: '' });

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeFilters, priceRange, verifiedOnly, urlSearchQuery, currentPage, itemsPerPage]);

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      if (category === 'Condition') {
        return { ...prev, [category]: [value] };
      }
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const removeFilter = (category: string, value: string) => {
    toggleFilter(category, value);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      Brands: [],
      Features: [],
      Condition: ['Any'],
      Ratings: [],
    });
    setPriceRange({ min: 0, max: 999999 });
  };

  const applyPriceFilter = () => {
    setPriceRange({
      min: tempPrice.min ? Number(tempPrice.min) : 0,
      max: tempPrice.max ? Number(tempPrice.max) : 999999,
    });
  };

  const activeFilterCount = Object.values(activeFilters).flat().filter(v => v !== 'Any').length + (priceRange.min > 0 || priceRange.max < 999999 ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter((product) => {
      // Search filter
      if (urlSearchQuery) {
        const query = urlSearchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesType = product.type.toLowerCase().includes(query);
        const matchesDescription = product.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesType && !matchesDescription) {
          return false;
        }
      }
      // Brands filter
      if (activeFilters.Brands.length > 0) {
        const matchesBrand = activeFilters.Brands.some(brand =>
          product.title.toLowerCase().includes(brand.toLowerCase()) ||
          product.description.toLowerCase().includes(brand.toLowerCase())
        );
        if (!matchesBrand) return false;
      }
      // Price filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }
      // Ratings filter
      if (activeFilters.Ratings.length > 0) {
        const productRating = Math.floor(product.rating || 0);
        const matchesRating = activeFilters.Ratings.some(rating => productRating >= Number(rating));
        if (!matchesRating) return false;
      }
      // Verified only filter
      if (verifiedOnly && !product.supplier?.verified) {
        return false;
      }
      return true;
    });
    return result;
  }, [activeFilters, urlSearchQuery, verifiedOnly, priceRange]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, priceRange, verifiedOnly, urlSearchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // --- Sub-components ---

  const SkeletonCard = () => (
    <div className="plp-skeleton-card bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="plp-skeleton-card__image aspect-square bg-gray-200" />
      <div className="plp-skeleton-card__content p-4 space-y-3">
        <div className="plp-skeleton-card__title h-4 bg-gray-200 rounded w-1/2" />
        <div className="plp-skeleton-card__description h-3 bg-gray-200 rounded w-full" />
        <div className="plp-skeleton-card__price h-3 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="plp-skeleton-list-item bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse flex flex-col sm:flex-row">
      <div className="plp-skeleton-list-item__image w-full sm:w-56 h-56 bg-gray-200 flex-shrink-0" />
      <div className="plp-skeleton-list-item__content p-6 flex-1 space-y-4">
        <div className="plp-skeleton-list-item__title h-6 bg-gray-200 rounded w-3/4" />
        <div className="plp-skeleton-list-item__price h-4 bg-gray-200 rounded w-1/4" />
        <div className="plp-skeleton-list-item__description h-4 bg-gray-200 rounded w-full" />
        <div className="plp-skeleton-list-item__description h-4 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );

  const FilterContent = () => (
    <>
      {/* Category */}
      <div className="plp-filter-section plp-filter-section--category p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('Category')}
          className="plp-filter-section__toggle flex justify-between items-center w-full mb-3"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Category</h3>
          {expandedSections.Category ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <AnimatePresence>
          {expandedSections.Category && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="plp-filter-section__list space-y-2 text-sm text-gray-600 overflow-hidden"
            >
              <li><button className="plp-filter-section__item hover:text-primary transition-colors">Mobile accessory</button></li>
              <li><button className="plp-filter-section__item hover:text-primary transition-colors">Electronics</button></li>
              <li><button className="plp-filter-section__item hover:text-primary transition-colors">Smartphones</button></li>
              <li><button className="plp-filter-section__item hover:text-primary transition-colors">Modern tech</button></li>
              <li><button className="plp-filter-section__see-all text-blue-600 hover:text-blue-700 transition-colors mt-1">See all</button></li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Brands */}
      <div className="plp-filter-section plp-filter-section--brands p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('Brands')}
          className="plp-filter-section__toggle flex justify-between items-center w-full mb-3"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Brands</h3>
          {expandedSections.Brands ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <AnimatePresence>
          {expandedSections.Brands && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="plp-filter-section__list space-y-2 overflow-hidden"
            >
              {BRANDS.map((brand) => (
                <label key={brand} className="plp-filter-option flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeFilters.Brands?.includes(brand) || false}
                    onChange={() => toggleFilter('Brands', brand)}
                    className="plp-filter-option__checkbox rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="plp-filter-option__label text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
                </label>
              ))}
              <button className="plp-filter-section__see-all text-blue-600 hover:text-blue-700 transition-colors text-sm mt-1">See all</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features */}
      <div className="plp-filter-section plp-filter-section--features p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('Features')}
          className="plp-filter-section__toggle flex justify-between items-center w-full mb-3"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Features</h3>
          {expandedSections.Features ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <AnimatePresence>
          {expandedSections.Features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="plp-filter-section__list space-y-2 overflow-hidden"
            >
              {FEATURES.map((feature) => (
                <label key={feature} className="plp-filter-option flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeFilters.Features?.includes(feature) || false}
                    onChange={() => toggleFilter('Features', feature)}
                    className="plp-filter-option__checkbox rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="plp-filter-option__label text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{feature}</span>
                </label>
              ))}
              <button className="plp-filter-section__see-all text-blue-600 hover:text-blue-700 transition-colors text-sm mt-1">See all</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price range */}
      <div className="plp-filter-section plp-filter-section--price p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('Price')}
          className="plp-filter-section__toggle flex justify-between items-center w-full mb-3"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Price range</h3>
          {expandedSections.Price ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <AnimatePresence>
          {expandedSections.Price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="plp-filter-section__content space-y-4 overflow-hidden"
            >
              <div className="plp-price-slider relative h-1 bg-gray-200 rounded-full mt-2">
                <div className="plp-price-slider__track absolute left-1/4 right-1/4 h-full bg-blue-500 rounded-full"></div>
                <div className="plp-price-slider__handle plp-price-slider__handle--min absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"></div>
                <div className="plp-price-slider__handle plp-price-slider__handle--max absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"></div>
              </div>
              <div className="plp-price-inputs flex items-center space-x-2">
                <div className="plp-price-inputs__group flex-1">
                  <label className="plp-price-inputs__label text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tempPrice.min}
                    onChange={(e) => setTempPrice({ ...tempPrice, min: e.target.value })}
                    className="plp-price-inputs__field w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="plp-price-inputs__group flex-1">
                  <label className="plp-price-inputs__label text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    placeholder="999999"
                    value={tempPrice.max}
                    onChange={(e) => setTempPrice({ ...tempPrice, max: e.target.value })}
                    className="plp-price-inputs__field w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                onClick={applyPriceFilter}
                className="plp-price-slider__apply-btn w-full py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors"
              >
                Apply
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Condition */}
      <div className="plp-filter-section plp-filter-section--condition p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('Condition')}
          className="plp-filter-section__toggle flex justify-between items-center w-full mb-3"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Condition</h3>
          {expandedSections.Condition ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <AnimatePresence>
          {expandedSections.Condition && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="plp-filter-section__list space-y-2 overflow-hidden"
            >
              {CONDITIONS.map((condition) => (
                <label key={condition} className="plp-filter-option flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="condition"
                    checked={activeFilters.Condition?.includes(condition) || false}
                    onChange={() => toggleFilter('Condition', condition)}
                    className="plp-filter-option__radio border-gray-300 text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="plp-filter-option__label text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{condition}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ratings */}
      <div className="plp-filter-section plp-filter-section--ratings p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection('Ratings')}
          className="plp-filter-section__toggle flex justify-between items-center w-full mb-3"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Ratings</h3>
          {expandedSections.Ratings ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
        <AnimatePresence>
          {expandedSections.Ratings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="plp-filter-section__list space-y-2 overflow-hidden"
            >
              {RATINGS.map((rating) => (
                <label key={rating} className="plp-filter-option flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeFilters.Ratings?.includes(rating.toString()) || false}
                    onChange={() => toggleFilter('Ratings', rating.toString())}
                    className="plp-filter-option__checkbox rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                  />
                  <div className="plp-filter-option__stars flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manufacturer */}
      <div className="plp-filter-section plp-filter-section--manufacturer p-4">
        <button
          onClick={() => toggleSection('Manufacturer')}
          className="plp-filter-section__toggle flex justify-between items-center w-full"
        >
          <h3 className="plp-filter-section__title font-bold text-sm text-gray-900">Manufacturer</h3>
          {expandedSections.Manufacturer ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </button>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="plp-page-container flex-1 flex flex-col lg:flex-row border-t border-border"
    >
      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="plp-mobile-overlay fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="plp-mobile-filter-drawer fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] lg:hidden overflow-y-auto"
            >
              <div className="plp-mobile-filter-drawer__header p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="plp-mobile-filter-drawer__title font-bold text-lg">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="plp-mobile-filter-drawer__close p-1">
                  <X size={24} />
                </button>
              </div>
              <FilterContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Filters */}
      <aside className="plp-sidebar hidden lg:block w-64 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto">
        <FilterContent />
      </aside>

      {/* Main Content */}
      <main className="plp-main-content flex-1 flex flex-col bg-gray-50">
        
        {/* Mobile Sub-categories Scroll */}
        <div className="plp-subcategories-scroll lg:hidden px-4 py-3 overflow-x-auto hide-scrollbar bg-white border-b border-gray-200">
          <div className="plp-subcategories-scroll__list flex items-center gap-2 whitespace-nowrap">
            <button className="plp-subcategories-scroll__tab plp-subcategories-scroll__tab--active px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100">Tablets</button>
            <button className="plp-subcategories-scroll__tab px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-transparent">Phones</button>
            <button className="plp-subcategories-scroll__tab px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-transparent">Ipads</button>
            <button className="plp-subcategories-scroll__tab px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-transparent">Iphone</button>
            <button className="plp-subcategories-scroll__tab px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-transparent">Samsung</button>
          </div>
        </div>

        {/* Breadcrumbs - Hidden on Mobile */}
        <div className="plp-breadcrumbs hidden lg:flex px-6 py-4 items-center text-sm text-gray-500 space-x-2">
          <Link to="/" className="plp-breadcrumbs__link hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="plp-breadcrumbs__link hover:text-primary transition-colors">Clothings</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="plp-breadcrumbs__link hover:text-primary transition-colors">Men's wear</Link>
          <ChevronRight size={14} />
          <span className="plp-breadcrumbs__current text-gray-900">Summer clothing</span>
        </div>

        {/* Top Bar / Toolbar */}
        <div className="plp-toolbar h-auto lg:h-16 border-b lg:border border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 lg:px-6 bg-white lg:mx-6 lg:rounded-md gap-4">
          <div className="plp-toolbar__left flex items-center justify-between w-full lg:w-auto">
            <div className="plp-toolbar__results-count hidden lg:block text-sm text-gray-900 font-medium">
              {filteredProducts.length} items in <span className="plp-toolbar__category-name font-bold">Mobile accessory</span>
            </div>
            
            {/* Mobile Sort/Filter Bar */}
            <div className="plp-toolbar__mobile-controls lg:hidden flex items-center justify-between w-full">
              <div className="plp-toolbar__mobile-sort-filter flex items-center gap-2">
                <div className="plp-toolbar__sort-wrapper relative">
                  <select className="plp-toolbar__sort-select appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium outline-none focus:border-primary cursor-pointer">
                    <option>Sort: Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown size={14} className="plp-toolbar__sort-icon absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="plp-toolbar__filter-btn flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  <span>Filter ({activeFilterCount})</span>
                  <Menu size={16} />
                </button>
              </div>
              <div className="plp-toolbar__view-toggle flex items-center border border-gray-200 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`plp-toolbar__view-btn plp-toolbar__view-btn--grid p-1.5 flex items-center justify-center transition-colors ${
                    viewMode === 'grid' ? 'bg-gray-100 text-gray-900 border-r border-gray-200' : 'bg-white text-gray-500 hover:text-gray-900 border-r border-gray-200'
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`plp-toolbar__view-btn plp-toolbar__view-btn--list p-1.5 flex items-center justify-center transition-colors ${
                    viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="plp-toolbar__filter-btn-desktop hidden lg:flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              <Menu size={16} />
              <span>Filters</span>
            </button>
          </div>

          <div className="plp-toolbar__right hidden lg:flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <label className="plp-toolbar__verified-toggle flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="plp-toolbar__verified-checkbox rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
              />
              <span className="plp-toolbar__verified-label text-sm text-gray-700">Verified only</span>
            </label>
            <div className="plp-toolbar__sort-wrapper-desktop relative flex-1 lg:flex-none">
              <select className="plp-toolbar__sort-select-desktop w-full appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm outline-none focus:border-primary cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="plp-toolbar__sort-icon-desktop absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="plp-toolbar__view-toggle-desktop flex items-center border border-gray-200 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`plp-toolbar__view-btn-desktop plp-toolbar__view-btn-desktop--grid p-1.5 flex items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900 border-r border-gray-200' : 'bg-white text-gray-500 hover:text-gray-900 border-r border-gray-200'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`plp-toolbar__view-btn-desktop plp-toolbar__view-btn-desktop--list p-1.5 flex items-center justify-center transition-colors ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:text-gray-900'
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && (
          <div className="plp-active-filters px-6 pt-4 flex flex-wrap items-center gap-2">
            {Object.entries(activeFilters).map(([category, values]) =>
              (values as string[]).filter(v => v !== 'Any').map(value => (
                <div key={`${category}-${value}`} className="plp-active-filters__tag flex items-center bg-white border border-blue-200 rounded-md px-2 py-1 text-sm text-gray-700">
                  {category === 'Ratings' ? `${value} star` : value}
                  <button
                    onClick={() => removeFilter(category, value)}
                    className="plp-active-filters__remove ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
            {(priceRange.min > 0 || priceRange.max < 999999) && (
              <div className="plp-active-filters__tag plp-active-filters__tag--price flex items-center bg-white border border-blue-200 rounded-md px-2 py-1 text-sm text-gray-700">
                ${priceRange.min} - ${priceRange.max === 999999 ? 'Any' : priceRange.max}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 999999 });
                    setTempPrice({ min: '', max: '' });
                  }}
                  className="plp-active-filters__remove ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button
              onClick={clearAllFilters}
              className="plp-active-filters__clear-all text-sm text-blue-600 hover:text-blue-700 font-medium ml-2"
            >
              Clear all filter
            </button>
          </div>
        )}

        {/* Product List/Grid */}
        <div className="plp-product-area p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === 'grid' ? "plp-product-area__skeleton-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "plp-product-area__skeleton-list flex flex-col gap-4"}
              >
                {[...Array(itemsPerPage)].map((_, i) => (
                  viewMode === 'grid' ? <SkeletonCard key={i} /> : <SkeletonList key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                {paginatedProducts.length === 0 ? (
                  <div className="plp-empty-state text-center py-20 bg-white rounded-lg border border-gray-200">
                    <Search size={48} className="plp-empty-state__icon mx-auto text-gray-300 mb-4" />
                    <h3 className="plp-empty-state__title text-lg font-medium text-gray-900">No products found</h3>
                    <p className="plp-empty-state__message text-gray-500">Try adjusting your filters or search query</p>
                    <button
                      onClick={clearAllFilters}
                      className="plp-empty-state__action mt-4 text-primary font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  viewMode === 'grid' ? (
                    <div className="plp-product-grid">
                      {paginatedProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="plp-product-card group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                          <div className="plp-product-card__image-wrapper aspect-square p-4 flex items-center justify-center bg-white border-b border-gray-100">
                            <img
                              src={Array.isArray(product.image) ? product.image[0] : product.image}
                              alt={product.title}
                              className="plp-product-card__image w-full h-full object-contain mix-blend-multiply  transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="plp-product-card__content p-4 flex-1 flex flex-col">
                            <div className="plp-product-card__header flex justify-between items-start mb-2">
                              <div className="plp-product-card__price-group flex items-baseline space-x-2">
                                <span className="plp-product-card__price font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                  <span className="plp-product-card__original-price text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                )}
                              </div>
                              <button className="plp-product-card__wishlist text-blue-500 hover:text-blue-600 p-1.5 border border-blue-100 rounded hover:bg-blue-50 transition-colors">
                                <Heart size={16} />
                              </button>
                            </div>
                            <div className="plp-product-card__rating-group flex items-center mb-2 space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < Math.floor(product.rating || 0) ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}
                                />
                              ))}
                              <span className="plp-product-card__rating-value text-orange-400 text-xs font-medium ml-1">{product.rating?.toFixed(1)}</span>
                            </div>
                            <h3 className="plp-product-card__title text-gray-600 text-sm mb-1 line-clamp-2">{product.title}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="plp-product-grid plp-product-grid--list">
                      {paginatedProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="plp-product-list-item group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row"
                        >
                          <div className="plp-product-list-item__image-wrapper w-full sm:w-56 h-56 p-4 flex-shrink-0 flex items-center justify-center bg-white border-b sm:border-b-0 sm:border-r border-gray-100">
                            <img
                              src={Array.isArray(product.image) ? product.image[0] : product.image}
                              alt={product.title}
                              className="plp-product-list-item__image w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="plp-product-list-item__content p-6 flex-1 flex flex-col relative">
                            <button className="plp-product-list-item__wishlist absolute top-6 right-6 text-blue-500 hover:text-blue-600 p-1.5 border border-blue-100 rounded hover:bg-blue-50 transition-colors">
                              <Heart size={16} />
                            </button>
                            <h3 className="plp-product-list-item__title text-base font-bold text-gray-900 mb-2 pr-12">{product.title}</h3>
                            <div className="plp-product-list-item__price-group flex items-baseline space-x-2 mb-3">
                              <span className="plp-product-list-item__price font-bold text-xl text-gray-900">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="plp-product-list-item__original-price text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="plp-product-list-item__meta flex items-center space-x-3 mb-4 text-sm">
                              <div className="plp-product-list-item__rating-group flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.floor(product.rating || 0) ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}
                                  />
                                ))}
                                <span className="plp-product-list-item__rating-value text-orange-400 font-medium ml-1">{product.rating?.toFixed(1)}</span>
                              </div>
                              <span className="plp-product-list-item__separator text-gray-300">•</span>
                              <span className="plp-product-list-item__orders text-gray-500">{product.orders || 0} orders</span>
                              {product.freeShipping && (
                                <>
                                  <span className="plp-product-list-item__separator text-gray-300">•</span>
                                  <span className="plp-product-list-item__shipping text-green-600 font-medium">Free Shipping</span>
                                </>
                              )}
                            </div>
                            <p className="plp-product-list-item__description text-sm text-gray-600 line-clamp-2 mb-4 max-w-2xl">{product.description}</p>
                            <div className="plp-product-list-item__action mt-auto">
                              <span className="plp-product-list-item__action-link text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">View details</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="plp-pagination px-6 pb-8 flex flex-col sm:flex-row justify-end items-center gap-4">
            <div className="plp-pagination__per-page-wrapper relative hidden sm:block">
              <select
                value={`Show ${itemsPerPage}`}
                onChange={(e) => setItemsPerPage(Number(e.target.value.split(' ')[1]))}
                className="plp-pagination__per-page-select appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option>Show 5</option>
                <option>Show 10</option>
                <option>Show 20</option>
                <option>Show 50</option>
              </select>
              <ChevronDown size={14} className="plp-pagination__per-page-icon absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="plp-pagination__controls flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="plp-pagination__btn plp-pagination__btn--prev px-3 py-1.5 text-gray-400 hover:text-gray-600 border-r border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`plp-pagination__btn plp-pagination__btn--page px-3 py-1.5 border-r border-gray-200 font-medium text-sm transition-colors ${
                    currentPage === i + 1 ? 'plp-pagination__btn--active bg-gray-100 text-gray-900' : 'plp-pagination__btn--inactive text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="plp-pagination__btn plp-pagination__btn--next px-3 py-1.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* You may also like - Mobile Only */}
        <div className="plp-mobile-recommendations lg:hidden p-6 bg-white border-t border-gray-200">
          <h3 className="plp-mobile-recommendations__title font-bold text-lg mb-4">You may also like</h3>
          <div className="plp-mobile-recommendations__grid grid grid-cols-2 gap-4">
            {PRODUCTS.slice(0, 4).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="plp-mobile-recommendations__item flex flex-col">
                <div className="plp-mobile-recommendations__image-wrapper aspect-square bg-gray-50 rounded-md p-2 mb-2 flex items-center justify-center border border-gray-100">
                  <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.title} className="plp-mobile-recommendations__image max-h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
                <h4 className="plp-mobile-recommendations__title text-sm text-gray-600 line-clamp-2 mb-1">{product.title}</h4>
                <span className="plp-mobile-recommendations__price font-bold text-gray-900">${product.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}