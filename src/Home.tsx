import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PRODUCTS } from './data/products';
import { User, Search, Shield, Send } from 'lucide-react';

export default function Home() {
  const deals = PRODUCTS.slice(0, 5);
  const homeOutdoor = PRODUCTS.slice(5, 13);
  // Add products from index 3 to 5 using splice method (avoiding duplicates)
  homeOutdoor.splice(0, 0, PRODUCTS[3], PRODUCTS[4]);
  const electronics = PRODUCTS.slice(13, 21);
  const recommended = PRODUCTS.slice(21, 31);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home-page-container flex-1 flex flex-col bg-gray-100 py-6"
    >
      <div className="home-content-wrapper max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full space-y-4 sm:space-y-6">
        
        {/* Hero Section */}
        <section className="home-hero-section flex flex-col lg:flex-row gap-0 sm:gap-4 h-auto lg:h-[400px]">
          {/* Left Sidebar - Categories */}
          <div className="home-categories-sidebar bg-white rounded-md p-4 w-full lg:w-64 flex-shrink-0 hidden lg:block border border-gray-200">
            <ul className="home-categories-list space-y-3 text-sm text-gray-600">
              <li><Link to="/products?search=automobiles" className="home-category-link hover:text-primary hover:font-medium transition-all">Automobiles</Link></li>
              <li><Link to="/products?search=clothes" className="home-category-link hover:text-primary hover:font-medium transition-all">Clothes and wear</Link></li>
              <li><Link to="/products?search=home" className="home-category-link hover:text-primary hover:font-medium transition-all">Home interiors</Link></li>
              <li><Link to="/products?search=tech" className="home-category-link hover:text-primary hover:font-medium transition-all">Computer and tech</Link></li>
              <li><Link to="/products?search=tools" className="home-category-link hover:text-primary hover:font-medium transition-all">Tools, equipments</Link></li>
              <li><Link to="/products?search=sports" className="home-category-link hover:text-primary hover:font-medium transition-all">Sports and outdoor</Link></li>
              <li><Link to="/products?search=animal" className="home-category-link hover:text-primary hover:font-medium transition-all">Animal and pets</Link></li>
              <li><Link to="/products?search=machinery" className="home-category-link hover:text-primary hover:font-medium transition-all">Machinery tools</Link></li>
              <li><Link to="/products" className="home-category-link home-category-link-more hover:text-primary hover:font-medium transition-all">More category</Link></li>
            </ul>
          </div>

          {/* Main Banner */}
          <div className="home-main-banner flex-1 relative sm:rounded-md overflow-hidden bg-gray-900 h-[200px] sm:h-auto">
            <img
              src="https://picsum.photos/seed/electronics/1200/600"
              alt="Latest trending Electronic items"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="home-banner-content relative z-10 p-6 sm:p-12 h-full flex flex-col justify-center items-start">
              <span className="small-heading-banner-text text-lg sm:text-2xl text-white mb-1 sm:mb-2">Latest trending</span>
              <h2 className="big-heading-banner-text text-2xl sm:text-5xl font-bold text-white mb-4 sm:mb-6 max-w-[200px] sm:max-w-md">Electronic Items</h2>
              <div className="big-heading-banner-button-wrapper">
                <Link
                  to="/products?search=electronics"
                  className="big-heading-banner-learn-more-button bg-white text-gray-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar - User Actions */}
          <div className="home-user-actions w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 hidden sm:flex">
            <div className="home-user-greeting bg-[#e3f0ff] rounded-md p-4 flex flex-col border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div className="text-sm">
                  <p className="text-gray-800">Hi, user</p>
                  <p className="text-gray-800">let's get stated</p>
                </div>
              </div>
              <button className="home-join-btn w-full bg-primary text-white py-2 rounded-md text-sm font-medium mb-2 hover:bg-primary-hover transition-colors">Join now</button>
              <button className="home-login-btn w-full bg-white text-primary py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Log in</button>
            </div>
            <div className="home-promo-discount bg-[#f38332] rounded-md p-4 flex-1 flex items-center text-white border border-gray-200">
              <p className="text-sm font-medium">Get US $10 off with a new supplier</p>
            </div>
            <div className="home-promo-quote bg-[#55bdc3] rounded-md p-4 flex-1 flex items-center text-white border border-gray-200">
              <p className="text-sm font-medium">Send quotes with supplier preferences</p>
            </div>
          </div>
        </section>

        {/* Deals and Offers */}
        <section className="home-deals-section bg-white sm:rounded-md border-y sm:border border-gray-200 flex flex-col md:flex-row overflow-hidden">
          <div className="home-deals-header p-4 sm:p-6 md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col items-center md:items-start justify-between md:justify-start">
            <div>
              <h3 className="home-deals-title text-lg sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">Deals & Offers</h3>
              <p className="home-deals-subtitle text-gray-500 text-xs sm:text-sm mb-0 sm:mb-4">Hurry! Limited time Offers</p>
            </div>
            <div className="home-countdown-timer flex gap-1.5 sm:gap-2">
              <div className="home-countdown-unit bg-gray-100 sm:bg-gray-800 text-gray-800 sm:text-white rounded-md w-10 h-12 sm:w-12 sm:h-14 flex flex-col items-center justify-center">
                <span className="home-countdown-value text-base sm:text-lg font-bold leading-none">13</span>
                <span className="home-countdown-label text-[8px] sm:text-[10px]">Hour</span>
              </div>
              <div className="home-countdown-unit bg-gray-100 sm:bg-gray-800 text-gray-800 sm:text-white rounded-md w-10 h-12 sm:w-12 sm:h-14 flex flex-col items-center justify-center">
                <span className="home-countdown-value text-base sm:text-lg font-bold leading-none">34</span>
                <span className="home-countdown-label text-[8px] sm:text-[10px]">Min</span>
              </div>
              <div className="home-countdown-unit bg-gray-100 sm:bg-gray-800 text-gray-800 sm:text-white rounded-md w-10 h-12 sm:w-12 sm:h-14 flex flex-col items-center justify-center">
                <span className="home-countdown-value text-base sm:text-lg font-bold leading-none">56</span>
                <span className="home-countdown-label text-[8px] sm:text-[10px]">Sec</span>
              </div>
            </div>
          </div>
          <div 
            className="home-deals-products flex-1 flex overflow-x-auto gap-3 sm:gap-4 p-4"
            onWheel={(e) => {
              if (e.shiftKey) {
                e.stopPropagation();
                e.currentTarget.scrollLeft += e.deltaY;
                e.preventDefault();
              }
            }}
          >
            {deals.map((product, index) => (
              <Link key={product.id} to={`/product/${product.id}`} className={`home-deal-card flex-shrink-0 w-32 sm:w-44 flex flex-col items-center justify-between border-r border-gray-200 ${index === deals.length - 1 ? 'border-r-0' : ''} hover:bg-gray-50 transition-colors overflow-hidden`}>
                <div className="home-deal-image w-full aspect-square p-4">
                  <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
                <div className="home-deal-info p-3 flex flex-col items-center w-full">
                  <p className="home-deal-title text-xs sm:text-sm text-gray-800 text-center line-clamp-1 mb-1 sm:mb-2">{product.title}</p>
                  <span className="home-deal-discount bg-[#ffe3e3] text-[#eb001b] text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">-25%</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Home and outdoor */}
        <section className="home-category-section bg-white sm:rounded-md border-y sm:border border-gray-200 flex flex-col md:flex-row overflow-hidden">
          <div className="home-category-banner md:w-72 flex-shrink-0 relative h-32 sm:h-48 md:h-auto hidden sm:block">
            <img src="https://picsum.photos/seed/homeoutdoor/600/800" alt="Home and outdoor" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="home-banner-overlay absolute inset-0 bg-black/20" />
            <div className="home-banner-content-2 relative z-10 p-6 h-full flex flex-col justify-start items-start">
              <h3 className="home-category-title text-xl font-bold text-gray-900 mb-4 w-32">Home & Outdoors</h3>
              <Link to="/products?search=home" className="home-category-cta bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">Source now</Link>
            </div>
          </div>
          <div className="home-category-mobile-header sm:hidden p-4 border-b border-gray-200">
            <h3 className="home-category-title-mobile text-base font-bold text-gray-900">Home & Outdoors</h3>
          </div>
          <div 
            className="home-category-products flex-1 grid grid-cols-3 sm:grid-cols-4 overflow-x-auto"
            onWheel={(e) => {
              if (e.shiftKey) {
                e.stopPropagation();
                e.currentTarget.scrollLeft += e.deltaY;
                e.preventDefault();
              }
            }}
          >
            {homeOutdoor.slice(0, 9).map((product, index) => (
              <Link key={product.id} to={`/product/${product.id}`} className={`home-product-card-2 relative h-28 sm:h-32 flex flex-col items-start border-b border-gray-200 border-r hover:bg-gray-50 transition-colors overflow-hidden p-3`}>
                <div className="home-product-info z-10 w-full">
                  <p className="home-product-title text-[10px] sm:text-sm text-gray-800 line-clamp-1">{product.title}</p>
                  <p className="home-product-price text-[8px] sm:text-xs text-gray-500 mt-0.5">From USD {Math.floor(product.price * 0.8)}</p>
                </div>
                <div className="home-product-image absolute bottom-1 right-1 w-12 h-12 sm:w-20 sm:h-20">
                  <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              </Link>
            ))}
            <div className="sm:hidden">
               {/* Just to fill grid if needed, or show more */}
            </div>
          </div>
          <div className="home-category-mobile-cta sm:hidden p-3 border-t border-gray-100">
            <Link to="/products?search=home" className="home-category-link text-primary text-sm font-medium flex items-center gap-1">
              Source now <span className="text-lg">→</span>
            </Link>
          </div>
        </section>

        {/* Consumer electronics */}
        <section className="home-category-section bg-white sm:rounded-md border-y sm:border border-gray-200 flex flex-col md:flex-row overflow-hidden">
          <div className="home-category-banner md:w-72 flex-shrink-0 relative h-32 sm:h-48 md:h-auto hidden sm:block">
            <img src="https://t4.ftcdn.net/jpg/03/64/41/07/360_F_364410756_Ev3WoDfNyxO9c9n4tYIsU5YBQWAP3UF8.jpg" alt="Consumer electronics" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="home-banner-overlay absolute inset-0 bg-black/20" />
            <div className="home-banner-content-3 relative z-10 p-6 h-full flex flex-col justify-start items-start">
              <h3 className="home-category-title text-xl font-bold text-gray-900 mb-4 w-40">Consumer Electronics</h3>
              <Link to="/products?search=electronics" className="home-category-cta bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">Source now</Link>
            </div>
          </div>
          <div className="home-category-mobile-header sm:hidden p-4 border-b border-gray-200">
            <h3 className="home-category-title-mobile text-base font-bold text-gray-900">Consumer Electronics</h3>
          </div>
          <div 
            className="home-category-products flex-1 grid grid-cols-3 sm:grid-cols-4 overflow-x-auto"
            onWheel={(e) => {
              if (e.shiftKey) {
                e.stopPropagation();
                e.currentTarget.scrollLeft += e.deltaY;
                e.preventDefault();
              }
            }}
          >
            {electronics.slice(0, 6).map((product, index) => (
              <Link key={product.id} to={`/product/${product.id}`} className={`home-product-card-3 relative h-28 sm:h-32 flex flex-col items-start border-b border-gray-200 border-r hover:bg-gray-50 transition-colors overflow-hidden p-3`}>
                <div className="home-product-info z-10 w-full">
                  <p className="home-product-title text-[10px] sm:text-sm text-gray-800 line-clamp-1">{product.title}</p>
                  <p className="home-product-price text-[8px] sm:text-xs text-gray-500 mt-0.5">From USD {Math.floor(product.price * 0.8)}</p>
                </div>
                <div className="home-product-image absolute bottom-1 right-1 w-12 h-12 sm:w-20 sm:h-20">
                  <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              </Link>
            ))}
          </div>
          <div className="home-category-mobile-cta sm:hidden p-3 border-t border-gray-100">
            <Link to="/products?search=electronics" className="home-category-link text-primary text-sm font-medium flex items-center gap-1">
              Source now <span className="text-lg">→</span>
            </Link>
          </div>
        </section>

        {/* Request for Quotation */}
        <section className="home-quotation-section relative sm:rounded-md overflow-hidden bg-primary h-auto sm:h-[350px] flex items-center py-8 sm:py-0">
          <img src="https://picsum.photos/seed/factory/1920/600" alt="Factory" className="home-quotation-bg absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" referrerPolicy="no-referrer" />
          <div className="home-quotation-content relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="home-quotation-text text-white max-w-md text-center sm:text-left">
              <h2 className="home-quotation-heading text-xl sm:text-3xl font-bold mb-2 sm:mb-4">An easy way to send requests to all suppliers</h2>
              <p className="home-quotation-subtitle text-xs sm:text-sm opacity-90 hidden sm:block">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
              <button className="home-quotation-mobile-btn sm:hidden bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium mt-2">Send inquiry</button>
            </div>
            <div className="home-quotation-form bg-white rounded-md p-6 w-full max-w-md shadow-lg hidden sm:block">
              <h3 className="home-quotation-form-title text-xl font-bold text-gray-900 mb-4">Send quote to suppliers</h3>
              <form className="home-quotation-form-fields space-y-4">
                <input type="text" placeholder="What item you need?" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
                <textarea placeholder="Type more details" rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
                <div className="flex gap-2">
                  <input type="text" placeholder="Quantity" className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
                  <select className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                    <option>Pcs</option>
                    <option>Kg</option>
                    <option>L</option>
                  </select>
                </div>
                <button type="button" className="home-quotation-submit-btn bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors">Send inquiry</button>
              </form>
            </div>
          </div>
        </section>

        {/* Recommended Items */}
        <section className="home-recommended-section px-4 sm:px-0">
          <h2 className="home-recommended-title text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recommended items</h2>
          <div className="home-recommended-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {recommended.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="home-recommended-card bg-white border border-gray-200 rounded-md hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                <div className="home-recommended-image w-full aspect-square bg-gray-50 p-4">
                  <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
                <div className="home-recommended-info p-3 sm:p-4">
                  <p className="home-recommended-price text-base sm:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1">${product.price.toFixed(2)}</p>
                  <p className="home-recommended-title text-xs sm:text-sm text-gray-500 line-clamp-2">{product.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Extra Services */}
        <section className="home-services-section">
          <h2 className="home-services-title text-2xl font-bold text-gray-900 mb-6">Our extra services</h2>
          <div className="home-services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Source from Industry Hubs", icon: <Search size={20} />, img: "https://picsum.photos/seed/service1/400/200" },
              { title: "Customize Your Products", icon: <User size={20} />, img: "https://picsum.photos/seed/service2/400/200" },
              { title: "Fast, reliable shipping by ocean or air", icon: <Send size={20} />, img: "https://picsum.photos/seed/service3/400/200" },
              { title: "Product monitoring and inspection", icon: <Shield size={20} />, img: "https://picsum.photos/seed/service4/400/200" }
            ].map((service, i) => (
              <div key={i} className="home-service-card bg-white border border-gray-200 rounded-md overflow-hidden group hover:shadow-md transition-shadow">
                <div className="home-service-image h-32 relative bg-gray-900">
                  <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="home-service-content p-4 relative">
                  <div className="home-service-icon absolute -top-6 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-white shadow-sm text-gray-700">
                    {service.icon}
                  </div>
                  <h3 className="home-service-title font-medium text-gray-900 pr-12 w-48">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suppliers by region */}
        <section className="home-suppliers-section pb-8">
          <h2 className="home-suppliers-title text-2xl font-bold text-gray-900 mb-6">Suppliers by region</h2>
          <div className="home-suppliers-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "Arabic Emirates", code: "ae", domain: "shop.ae" },
              { name: "Australia", code: "au", domain: "shop.ae" },
              { name: "United States", code: "us", domain: "shop.ae" },
              { name: "Russia", code: "ru", domain: "shop.ae" },
              { name: "Italy", code: "it", domain: "shop.ae" },
              { name: "Denmark", code: "dk", domain: "shop.ae" },
              { name: "France", code: "fr", domain: "shop.ae" },
              { name: "Arabic Emirates", code: "ae", domain: "shop.ae" },
              { name: "China", code: "cn", domain: "shop.ae" },
              { name: "Great Britain", code: "gb", domain: "shop.ae" },
            ].map((country, i) => (
              <div key={i} className="home-supplier-item flex items-center gap-3">
                <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} className="home-supplier-flag w-8 h-6 object-cover rounded-sm" />
                <div>
                  <p className="home-supplier-name text-sm font-medium text-gray-900">{country.name}</p>
                  <p className="home-supplier-domain text-xs text-gray-500">{country.domain}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
