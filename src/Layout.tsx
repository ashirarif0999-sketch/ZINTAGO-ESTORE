import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { X, Search, ShoppingCart, User, MessageSquare, Package, Menu, ChevronDown, ChevronLeft, Globe, Facebook, Twitter, Linkedin, Instagram, Youtube, Home, List as ListIcon, Heart, Headphones, Info, FileText, Users, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { mobileSearchControl } from './MobileSearch';
import LoadingSpinner from './LoadingSpinner';
import { getAllOrders, Order } from './ordersDb';

export default function Layout() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, cartTotal, cartCount, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderBottomHidden, setIsHeaderBottomHidden] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [showMobileOrders, setShowMobileOrders] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const lastScrollY = useRef(0);
  const lastScrollDirection = useRef<'up' | 'down'>('down');
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.orders-dropdown-container')) {
        setShowOrdersDropdown(false);
      }
    };
    
    if (showOrdersDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOrdersDropdown]);
  
  // Load orders from IndexedDB
  const loadOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
    setIsOrdersLoading(false);
  };
  
  // Handle Orders button click
  const handleOrdersClick = async () => {
    if (!showOrdersDropdown) {
      await loadOrders();
    }
    setShowOrdersDropdown(!showOrdersDropdown);
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.4,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  // Header bottom visibility controlled only by toggle button - no scroll conditions
  // Initial state: visible (not hidden)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <div className="layout__wrapper min-h-screen flex flex-col bg-background text-text font-body">
      
      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="layout__mobile-overlay fixed inset-0 bg-black/50 z-[60] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="layout__mobile-sidebar fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] md:hidden flex flex-col shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="layout__sidebar-header bg-gray-100 p-4 flex flex-col gap-3 relative">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="layout__sidebar-close-btn absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
                <div className="layout__user-avatar-placeholder w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                  <User size={24} />
                </div>
                <div className="layout__auth-links text-sm font-medium">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="layout__auth-link">Sign in</Link>
                  <span className="mx-1">|</span>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="layout__auth-link">Register</Link>
                </div>
              </div>

              {/* Sidebar Navigation Groups */}
              <div className="layout__sidebar-content flex-1 overflow-y-auto py-2">
                
                {/* Primary Nav */}
                <nav className="layout__nav-group flex flex-col">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="layout__nav-item">
                    <Home size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">Home</span>
                  </Link>
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="layout__nav-item">
                    <ListIcon size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">Categories</span>
                  </Link>
                  <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="layout__nav-item">
                    <Heart size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">Favorites</span>
                  </Link>
                  <button 
                    onClick={() => {
                      loadOrders();
                      setShowMobileOrders(true);
                      setIsMobileMenuOpen(false);
                    }} 
                    className="layout__nav-item w-full text-left flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <Package size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">My orders</span>
                  </button>
                </nav>

                <div className="layout__divider h-px bg-gray-200 my-2 mx-4" />

                {/* Secondary Nav */}
                <nav className="layout__nav-group flex flex-col">
                  <button className="layout__nav-item layout__nav-item--action">
                    <Globe size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">English | USD</span>
                  </button>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="layout__nav-item">
                    <Headphones size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">Contact us</span>
                  </Link>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="layout__nav-item">
                    <Info size={20} className="layout__nav-icon" />
                    <span className="layout__nav-label">About</span>
                  </Link>
                </nav>

                <div className="layout__divider h-px bg-gray-200 my-2 mx-4" />

                {/* Legal Nav */}
                <nav className="layout__nav-group layout__nav-group--legal flex flex-col">
                  <Link to="/user-agreement" onClick={() => setIsMobileMenuOpen(false)} className="layout__legal-link">
                    User agreement
                  </Link>
                  <Link to="/partnership" onClick={() => setIsMobileMenuOpen(false)} className="layout__legal-link">
                    Partnership
                  </Link>
                  <Link to="/privacy-policy" onClick={() => setIsMobileMenuOpen(false)} className="layout__legal-link">
                    Privacy policy
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Orders Drawer */}
      <AnimatePresence>
        {showMobileOrders && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[70] md:hidden"
              onClick={() => setShowMobileOrders(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-[80] md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">My Orders</h2>
                <button 
                  onClick={() => setShowMobileOrders(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Orders List */}
              <div className="flex-1 overflow-y-auto">
                {isOrdersLoading ? (
                  <div className="p-6 flex justify-center">
                    <LoadingSpinner size={32} />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-6 text-center">
                    <Package size={60} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-base text-gray-500">No orders yet</p>
                    <p className="text-sm text-gray-400 mt-1">Your order history will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <div key={order.orderNumber} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-sm font-medium">{order.orderNumber}</span>
                            <p className="text-xs text-gray-400">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <img 
                            src={order.items[0]?.image} 
                            alt={order.items[0]?.title}
                            className="w-16 h-16 object-contain rounded border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 truncate">{order.items[0]?.title}</p>
                            <p className="text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                            <p className="text-sm font-medium mt-1">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <header className="layout__desktop-header bg-surface border-b border-border hidden md:block">
        {/* Top Bar */}
        <div className="layout__header-top max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Logo */}
          <Link to="/" className="layout__brand-link flex items-center gap-2 flex-shrink-0">
            <img src="/fonts/logo-brand.png" alt="Zintago" style={{ width: '150px', height: 'auto' }} className="layout__brand-logo h-10 w-auto" />
          </Link>

          {/* Search Bar */}
          <div className="layout__search-container flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="layout__search-form flex w-full border-2 border-primary rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="layout__search-input flex-1 px-4 py-2 outline-none text-sm"
              />
              <div className="layout__search-category-trigger border-l border-border flex items-center px-3 bg-surface text-sm text-text cursor-pointer hover:bg-gray-50">
                All Categories <ChevronDown size={16} className="ml-2 text-muted" />
              </div>
              <button type="submit" className="layout__search-submit-btn bg-primary text-white px-6 py-2 hover:bg-primary-hover transition-colors">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Utility Icons */}
          <div className="layout__utility-nav flex items-center gap-6 text-muted flex-shrink-0">
            <button className="layout__utility-item flex flex-col items-center gap-1 hover:text-primary transition-colors">
              <User size={20} />
              <span className="layout__utility-label text-[10px] font-medium">Profile</span>
            </button>
            <button className="layout__utility-item flex flex-col items-center gap-1 hover:text-primary transition-colors">
              <MessageSquare size={20} />
              <span className="layout__utility-label text-[10px] font-medium">Message</span>
            </button>
            <div className="relative orders-dropdown-container">
              <button 
                className="layout__utility-item flex flex-col items-center gap-1 hover:text-primary transition-colors"
                onClick={handleOrdersClick}
              >
                <Package size={20} />
                <span className="layout__utility-label text-[10px] font-medium">Orders</span>
              </button>
              
              {/* Orders Dropdown */}
              <AnimatePresence>
                {showOrdersDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                    style={{ maxHeight: '420px' }}
                  >
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-medium text-sm uppercase tracking-widest">My Orders</h3>
                    </div>
                    
                    <div 
                      className="overflow-y-auto" 
                      style={{ maxHeight: '320px' }}
                      onWheel={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      {isOrdersLoading ? (
                        <div className="p-6 flex justify-center">
                          <LoadingSpinner size={24} />
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="p-6 text-center">
                          <Package size={40} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-sm text-gray-500">No orders yet</p>
                          <p className="text-xs text-gray-400 mt-1">Your order history will appear here</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {orders.map((order) => (
                            <div key={order.orderNumber} className="p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium">{order.orderNumber}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <img 
                                  src={order.items[0]?.image} 
                                  alt={order.items[0]?.title}
                                  className="w-10 h-10 object-contain rounded border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-600 truncate">{order.items[0]?.title}</p>
                                  <p className="text-[10px] text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">
                                  {new Date(order.date).toLocaleDateString()}
                                </span>
                                <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              className="layout__utility-item layout__cart-trigger flex flex-col items-center gap-1 hover:text-primary transition-colors relative" 
              onClick={openCart}
            >
              <ShoppingCart size={20} />
              <span className="layout__utility-label text-[10px] font-medium">My cart</span>
              {cartCount > 0 && (
                <span className="layout__cart-badge absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Toggle Button for Header Bottom */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <button 
            onClick={() => setIsHeaderBottomHidden(!isHeaderBottomHidden)}
            className="layout__header-toggle -mt-3 relative z-10 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary-hover transition-colors"
            aria-label={isHeaderBottomHidden ? 'Show navigation' : 'Hide navigation'}
          >
            <i className={`bx ${isHeaderBottomHidden ? 'bx-caret-down' : 'bx-caret-up'} text-xl`} />
          </button>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="layout__header-bottom border-t border-border overflow-hidden"
          initial={{ opacity: 1, height: 'auto', y: 0 }}
          animate={{ 
            opacity: isHeaderBottomHidden ? 0 : 1, 
            height: isHeaderBottomHidden ? 0 : 'auto',
            y: isHeaderBottomHidden ? -20 : 0 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ display: isHeaderBottomHidden ? 'none' : 'block' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-sm font-medium text-text">
            <div className="layout__bottom-nav-left flex items-center gap-6">
              <button className="layout__bottom-nav-item flex items-center gap-2 hover:text-primary">
                <Menu size={18} /> All category
              </button>
              <Link to="/products" className="layout__bottom-nav-link hover:text-primary">Hot offers</Link>
              <Link to="/products" className="layout__bottom-nav-link hover:text-primary">Menu item</Link>
              <button className="layout__bottom-nav-item flex items-center gap-1 hover:text-primary">
                Help <ChevronDown size={14} className="text-muted" />
              </button>
            </div>
            <div className="layout__bottom-nav-right flex items-center gap-6">
              <button className="layout__bottom-nav-item flex items-center gap-2 hover:text-primary">
                <Globe size={16} className="text-muted" /> English - USD <ChevronDown size={14} className="text-muted" />
              </button>
              <button className="layout__bottom-nav-item flex items-center gap-2 hover:text-primary">
                Ship to <span className="text-lg leading-none">🇦🇺</span> <ChevronDown size={14} className="text-muted" />
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile Navigation Header */}
      <header className="layout__mobile-header bg-surface border-b border-border md:hidden flex flex-col sticky top-0 z-40">
        <div className="layout__mobile-header-row px-4 h-14 flex items-center justify-between">
          <div className="layout__mobile-start-actions flex items-center gap-4">
            {location.pathname === '/products' || location.pathname.startsWith('/product/') || location.pathname === '/addtocart' ? (
              <button onClick={() => navigate(-1)} className="layout__mobile-back-btn text-text">
                <ChevronLeft size={24} />
              </button>
            ) : (
              <button onClick={() => setIsMobileMenuOpen(true)} className="layout__mobile-menu-btn text-text">
                <Menu size={24} />
              </button>
            )}
            
            {location.pathname === '/products' ? (
              <span className="layout__mobile-page-title font-bold text-lg text-gray-900">Smartphones</span>
            ) : location.pathname.startsWith('/product/') ? (
              <span className="layout__mobile-page-title font-bold text-lg text-gray-900 line-clamp-1 max-w-[150px]">Product Details</span>
            ) : location.pathname === '/addtocart' ? (
              <span className="layout__mobile-page-title font-bold text-lg text-gray-900">My Cart</span>
            ) : (
              <Link to="/" className="layout__mobile-brand-link flex items-center gap-2">
                <img src="/fonts/logo-brand.png" alt="Zintago" style={{ width: '125px', height: 'auto' }} className="layout__brand-logo h-10 w-auto" />
              </Link>
            )}
          </div>
          
          <div className="layout__mobile-end-actions flex items-center gap-4 text-text">
            <button 
              className="layout__mobile-search-btn hover:text-primary transition-colors"
              onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
              aria-label="Toggle search"
            >
              <Search size={24} />
            </button>
            <button 
              className="layout__mobile-cart-btn hover:text-primary transition-colors relative" 
              onClick={openCart}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="layout__mobile-cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="layout__mobile-profile-btn hover:text-primary transition-colors">
              <User size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search (visible when toggled) */}
        {isMobileSearchVisible && (
          <div className="layout__mobile-search-wrapper px-4 pb-3">
            <form onSubmit={handleSearch} className="layout__mobile-search-form flex w-full border border-border rounded-md overflow-hidden bg-gray-50">
              <div className="layout__mobile-search-icon-wrapper pl-3 flex items-center text-muted">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="layout__mobile-search-input flex-1 px-3 py-2 outline-none text-sm bg-transparent"
              />
            </form>
          </div>
        )}

        {/* Mobile Category Scroll (Home Only) */}
        {location.pathname === '/' && (
          <div className="layout__mobile-categories-wrapper px-4 pb-3 overflow-x-auto hide-scrollbar">
            <div className="layout__mobile-categories-list flex items-center gap-2 whitespace-nowrap">
              <Link to="/products" className="layout__category-pill layout__category-pill--active">All category</Link>
              <Link to="/products?search=gadgets" className="layout__category-pill">Gadgets</Link>
              <Link to="/products?search=clothes" className="layout__category-pill">Clothes</Link>
              <Link to="/products?search=accessories" className="layout__category-pill">Accessories</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="layout__main-content flex-1 flex flex-col bg-background">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="layout__footer bg-surface mt-auto">
        
        {/* Newsletter Section */}
        <div className="layout__newsletter-section bg-gray-200 py-10">
          <div className="layout__newsletter-container max-w-3xl mx-auto px-4 text-center">
            <h3 className="layout__newsletter-title text-xl font-bold text-text mb-2">Subscribe to our newsletter</h3>
            <p className="layout__newsletter-desc text-muted text-sm mb-6">Get daily news on upcoming offers from many suppliers all over the world</p>
            <form className="layout__newsletter-form flex max-w-md mx-auto gap-2">
              <div className="layout__newsletter-input-wrapper flex-1 relative">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="layout__newsletter-input w-full pl-10 pr-4 py-2 rounded-md border border-border outline-none focus:border-primary"
                />
                <MessageSquare className="layout__newsletter-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              </div>
              <button 
                type="submit" 
                onClick={() => {
                  setIsNewsletterLoading(true);
                  setTimeout(() => setIsNewsletterLoading(false), 900);
                }}
                disabled={isNewsletterLoading}
                className="layout__newsletter-submit-btn bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors flex items-center justify-center min-w-[100px]"
              >
                {isNewsletterLoading ? <LoadingSpinner size={18} /> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="layout__footer-links-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="layout__footer-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand Column */}
            <div className="layout__footer-brand-col lg:col-span-2">
              <Link to="/" className="layout__footer-brand-link flex items-center gap-2 mb-4">
                <img src="/fonts/logo-brand.png" alt="Zintago" style={{ width: '150px', height: 'auto' }} className="layout__footer-logo h-10 w-auto" />
              </Link>
              <p className="layout__footer-brand-desc text-muted text-sm mb-6 max-w-xs">
                Best information about the company goes here but now lorem ipsum is
              </p>
              <div className="layout__social-links flex gap-3">
                <a href="#" className="layout__social-link w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-primary transition-colors"><Facebook size={16} /></a>
                <a href="#" className="layout__social-link w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-primary transition-colors"><Twitter size={16} /></a>
                <a href="#" className="layout__social-link w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-primary transition-colors"><Linkedin size={16} /></a>
                <a href="#" className="layout__social-link w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-primary transition-colors"><Instagram size={16} /></a>
                <a href="#" className="layout__social-link w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-primary transition-colors"><Youtube size={16} /></a>
              </div>
            </div>

            {/* Link Columns */}
            <div className="layout__footer-col">
              <h4 className="layout__footer-col-title font-bold text-text mb-4">About</h4>
              <ul className="layout__footer-list space-y-2 text-sm text-muted">
                <li><a href="#" className="layout__footer-link hover:text-primary">About us</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Find Store</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Categories</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Blogs</a></li>
              </ul>
            </div>

            <div className="layout__footer-col">
              <h4 className="layout__footer-col-title font-bold text-text mb-4">Partnership</h4>
              <ul className="layout__footer-list space-y-2 text-sm text-muted">
                <li><a href="#" className="layout__footer-link hover:text-primary">About us</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Find Store</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Categories</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Blogs</a></li>
              </ul>
            </div>

            <div className="layout__footer-col">
              <h4 className="layout__footer-col-title font-bold text-text mb-4">Information</h4>
              <ul className="layout__footer-list space-y-2 text-sm text-muted">
                <li><a href="#" className="layout__footer-link hover:text-primary">Help center</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Money refund</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Shipping</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Contact us</a></li>
              </ul>
            </div>

            <div className="layout__footer-col">
              <h4 className="layout__footer-col-title font-bold text-text mb-4">For users</h4>
              <ul className="layout__footer-list space-y-2 text-sm text-muted">
                <li><a href="#" className="layout__footer-link hover:text-primary">Login</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Register</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">Setting</a></li>
                <li><a href="#" className="layout__footer-link hover:text-primary">My orders</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom Bar */}
        <div className="layout__footer-bottom border-t border-border bg-gray-100 py-4">
          <div className="layout__footer-bottom-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
            <p className="layout__copyright">© 2026 Ecommerce.</p>
            <div className="layout__locale-selector flex items-center gap-2">
              <Globe size={16} /> English - USD <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="cart-drawer__overlay fixed inset-0 bg-black/40 z-50"
              onClick={closeCart}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="cart-drawer__panel fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface z-50 shadow-2xl flex flex-col"
            >
              <div className="cart-drawer__header h-20 border-b border-border flex items-center justify-between px-6">
                <h2 className="cart-drawer__title font-display text-xl font-bold text-text">My Cart ({cartCount})</h2>
                <button
                  onClick={closeCart}
                  className="cart-drawer__close-btn p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-muted" />
                </button>
              </div>

              <div className="cart-drawer__content flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="cart-drawer__empty-state text-center py-12">
                    <ShoppingCart size={48} className="cart-drawer__empty-icon mx-auto text-gray-300 mb-4" />
                    <p className="cart-drawer__empty-text text-muted text-lg">Your cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="cart-drawer__item-card flex gap-4 border border-border p-3 rounded-lg">
                      <div className="cart-drawer__item-image-wrapper w-24 h-24 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                        <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.title} className="cart-drawer__item-image w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="cart-drawer__item-details flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="cart-drawer__item-title text-sm font-medium text-text line-clamp-2">{item.title}</h3>
                          <p className="cart-drawer__item-price text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="cart-drawer__item-actions flex items-center justify-between mt-2">
                          <div className="cart-drawer__quantity-control flex items-center border border-border rounded-md overflow-hidden">
                            <button
                              className="cart-drawer__qty-btn cart-drawer__qty-btn--decrease px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 transition-colors text-text"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="cart-drawer__qty-value px-3 py-1 text-sm border-x border-border min-w-[40px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              className="cart-drawer__qty-btn cart-drawer__qty-btn--increase px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 transition-colors text-text"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, 0)}
                            className="cart-drawer__remove-btn text-red-500 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="cart-drawer__footer border-t border-border p-6 space-y-4 bg-gray-50">
                  <div className="cart-drawer__subtotal-row flex justify-between text-text font-medium">
                    <span>Subtotal</span>
                    <span className="cart-drawer__subtotal-value text-lg font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="cart-drawer__disclaimer text-sm text-muted text-center">Taxes and shipping calculated at checkout</p>
                  <button
                    onClick={() => {
                      setIsCheckoutLoading(true);
                      setTimeout(() => {
                        setIsCheckoutLoading(false);
                        navigate('/checkout');
                        closeCart();
                      }, 900);
                    }}
                    disabled={isCheckoutLoading}
                    className={`cart-drawer__checkout-btn block w-full text-center py-3 rounded-md font-medium shadow-sm flex items-center justify-center gap-2 transition-colors ${
                      isCheckoutLoading 
                        ? 'bg-white text-gray-700 border-2 border-gray-600' 
                        : 'bg-primary text-white hover:bg-primary-hover border-none'
                    }`}
                  >
                    {isCheckoutLoading ? <LoadingSpinner size={18} /> : null}
                    {isCheckoutLoading ? '' : 'Checkout'}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/addtocart');
                      closeCart();
                    }}
                    className="cart-drawer__show-cart-btn block w-full text-center py-3 rounded-md font-medium shadow-sm flex items-center justify-center gap-2 transition-colors bg-white text-primary border border-primary hover:bg-gray-50"
                  >
                    Show Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}