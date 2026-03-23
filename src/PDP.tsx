import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { motion } from 'motion/react';
import { PRODUCTS } from './data/products';
import LoadingSpinner from './LoadingSpinner';
import { Check, Heart, MessageSquare, Shield, Star, ChevronRight, ShoppingCart, Globe, Truck, X, Maximize2, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function PDP() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="pdp-not-found-wrapper flex-1 flex items-center justify-center flex-col space-y-4 bg-gray-100">
        <h1 className="pdp-not-found-title font-display text-4xl font-bold text-gray-900">Product Not Found</h1>
        <Link to="/products" className="pdp-back-to-shop-link text-primary hover:underline font-medium">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Use provided images array, or fallback to single image
  const images = product.images && product.images.length > 0 
    ? product.images 
    : Array.isArray(product.image)
      ? product.image
      : product.image 
        ? [product.image] 
        : [];

  const [mainImage, setMainImage] = useState(images[0]);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update mainImage when product/images change
  useEffect(() => {
    setMainImage(images[0]);
  }, [images]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Navigation helpers for fullscreen modal
  const currentIndex = images.indexOf(mainImage);
  const hasLeftImage = currentIndex > 0;
  const hasRightImage = currentIndex < images.length - 1;

  const goToPreviousImage = () => {
    if (hasLeftImage) {
      setMainImage(images[currentIndex - 1]);
    }
  };

  const goToNextImage = () => {
    if (hasRightImage) {
      setMainImage(images[currentIndex + 1]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
      setIsAdding(false);
    }, 900);
  };

  const priceTiers = product.priceTiers || [
    { range: '50-100 pcs', price: product.price },
    { range: '100-700 pcs', price: product.price * 0.9 },
    { range: '700+ pcs', price: product.price * 0.8 },
  ];

  return (
    <>
      {/* Fullscreen Image Viewer */}
      {isFullscreen && (
        <div className="pdp-fullscreen-modal fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setIsFullscreen(false) }}>
          <button 
            className="pdp-fullscreen-close absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={32} />
          </button>
          
          {/* Left Navigation Button */}
          <button
            className={`pdp-fullscreen-nav-left absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full transition-all text-white mix-blend-difference ${hasLeftImage ? 'hover:bg-white/20 cursor-pointer' : 'cursor-not-allowed opacity-30'}`}
            onClick={goToPreviousImage}
            disabled={!hasLeftImage}
          >
            <ChevronLeft size={40} />
          </button>
          
          {/* Right Navigation Button */}
          <button
            className={`pdp-fullscreen-nav-right absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full transition-all text-white mix-blend-difference ${hasRightImage ? 'hover:bg-white/20 cursor-pointer' : 'cursor-not-allowed opacity-30'}`}
            onClick={goToNextImage}
            disabled={!hasRightImage}
          >
            <ChevronRightIcon size={40} />
          </button>
          
          {/* Image Indicator Dots */}
          <div className="pdp-fullscreen-dots absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${mainImage === images[idx] ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'}`}
                onClick={() => setMainImage(images[idx])}
              />
            ))}
          </div>
          
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
              <img 
                src={mainImage} 
                alt={product.title} 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pdp-page-container flex-1 flex flex-col bg-gray-100 py-6"
    >
      <div className="pdp-content-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        
        {/* Breadcrumbs - Hidden on Mobile */}
        <nav className="pdp-breadcrumbs hidden lg:flex items-center text-sm text-gray-500 gap-2">
          <Link to="/" className="pdp-breadcrumb-home hover:text-primary">Home</Link>
          <ChevronRight size={16} />
          <Link to={`/products?search=${product.type}`} className="pdp-breadcrumb-category hover:text-primary">{product.type}</Link>
          <ChevronRight size={16} />
          <span className="pdp-breadcrumb-current text-gray-900">{product.title}</span>
        </nav>

        {/* Main Product Card */}
        <div className="pdp-product-card bg-white rounded-md border border-gray-200 p-4 md:p-6 flex flex-col lg:flex-row gap-8">
          
          {/* Left: Images */}
          <div className="pdp-image-gallery w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-4">
            <div 
              className="pdp-main-image-container w-full aspect-square border border-gray-200 rounded-md overflow-hidden bg-gray-50 relative cursor-zoom-in group"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                src={mainImage}
                alt={product.title}
                className="pdp-main-image w-full h-full object-cover mix-blend-multiply transition-transform duration-200 ease-out"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isHovering ? 'scale(2)' : 'scale(1)'
                }}
                referrerPolicy="no-referrer"
              />
              
              {/* Mobile Carousel Dots */}
              <div className="pdp-carousel-dots lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`pdp-carousel-dot w-2 h-2 rounded-full transition-colors ${mainImage === images[idx] ? 'bg-primary' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className={`pdp-thumbnail-list hidden lg:flex gap-2 overflow-x-auto hide-scrollbar ${images.length <= 1 ? 'hidden' : ''}`}>
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`pdp-thumbnail-button w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden bg-gray-50 transition-colors ${mainImage === img ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img
                    src={img}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className="pdp-thumbnail-image w-full h-full object-cover mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

            {/* Middle: Product Info */}
          <div className="pdp-product-info flex-1 flex flex-col">
            <div className="pdp-stock-status hidden lg:flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
              <Check size={16} /> In stock
            </div>
            <h1 className="pdp-product-title text-lg lg:text-xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>
            
            <div className="pdp-product-meta flex flex-wrap items-center gap-4 text-sm mb-4">
              <div className="pdp-rating-container flex items-center text-[#ff9017] gap-1">
                <div className="pdp-star-rating flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill={star <= (product.rating || 4) ? "currentColor" : "none"} className={star <= (product.rating || 4) ? "text-[#ff9017]" : "text-gray-300"} />
                  ))}
                </div>
                <span className="pdp-rating-value font-medium ml-1">{product.rating || 4.5}</span>
              </div>
              <div className="pdp-reviews-count flex items-center gap-2 text-gray-500">
                <MessageSquare size={16} />
                <span>{product.reviews || 32} reviews</span>
              </div>
              <div className="pdp-sales-count flex items-center gap-2 text-gray-500">
                <ShoppingCart size={16} />
                <span>154 sold</span>
              </div>
            </div>

            {/* Price Tiers */}
            <div className="pdp-price-tiers bg-[#fff0e5] lg:bg-[#fff0e5] rounded-md p-4 flex flex-wrap gap-6 mb-6">
              {priceTiers.map((tier, idx) => (
                <div key={idx} className={`pdp-price-tier flex flex-col ${idx !== priceTiers.length - 1 ? 'border-r border-[#ffcda3] pr-6' : ''}`}>
                  <span className="pdp-tier-price text-lg lg:text-xl font-bold text-[#eb001b]">${tier.price.toFixed(2)}</span>
                  <span className="pdp-tier-range text-[10px] lg:text-xs text-gray-600">{tier.range}</span>
                </div>
              ))}
            </div>

            {/* Attributes */}
            <div className="pdp-product-attributes grid grid-cols-[100px_1fr] gap-y-3 text-sm mb-6 border-b border-gray-200 pb-6">
              {product.price && (
                <>
                  <div className="pdp-attribute-label text-gray-500">Price:</div>
                  <div className="pdp-attribute-value text-gray-900">${product.price}</div>
                </>
              )}
              
              {product.type && (
                <>
                  <div className="pdp-attribute-label text-gray-500">Type:</div>
                  <div className="pdp-attribute-value text-gray-900">{product.type}</div>
                </>
              )}
              
              {product.material && (
                <>
                  <div className="pdp-attribute-label text-gray-500">Material:</div>
                  <div className="pdp-attribute-value text-gray-900">{product.material}</div>
                </>
              )}
              
              {product.brand && (
                <>
                  <div className="pdp-attribute-label text-gray-500">Brand:</div>
                  <div className="pdp-attribute-value text-gray-900">{product.brand}</div>
                </>
              )}
              
              {product.sku && (
                <>
                  <div className="pdp-attribute-label text-gray-500">SKU:</div>
                  <div className="pdp-attribute-value text-gray-900">{product.sku}</div>
                </>
              )}
              
              {product.color && (
                <>
                  <div className="pdp-attribute-label text-gray-500">Color:</div>
                  <div className="pdp-attribute-value text-gray-900">{product.color}</div>
                </>
              )}
              
              {/* Render dynamic specs */}
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="pdp-attribute-label text-gray-500">{key}:</div>
                  <div className="pdp-attribute-value text-gray-900">{value}</div>
                </React.Fragment>
              ))}
              
              {product.stockStatus && (
                <>
                  <div className="pdp-attribute-label text-gray-500">Stock:</div>
                  <div className="pdp-attribute-value text-gray-900">{product.stockStatus}</div>
                </>
              )}
            </div>

            {/* Actions - Hidden on Mobile (will use sticky bottom) */}
            {/* Moved to supplier section */}
          </div>

          {/* Right: Supplier Card */}
          <div className="pdp-supplier-section hidden lg:block w-full lg:w-72 flex-shrink-0">
            <div className="pdp-supplier-card border border-gray-200 rounded-md p-4 bg-white shadow-sm">
              <div className="pdp-supplier-header flex items-center gap-3 mb-4 border-b border-gray-200 pb-4">
                <div className="pdp-supplier-logo w-12 h-12 bg-[#c6f3f1] text-[#4ca7a7] rounded-md flex items-center justify-center font-bold text-xl">
                  R
                </div>
                <div className="pdp-supplier-info">
                  <h3 className="pdp-supplier-name font-medium text-gray-900">{product.supplier?.name || 'Supplier Name LLC'}</h3>
                  <div className="pdp-supplier-verified flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Shield size={14} className="text-green-600" /> Verified Supplier
                  </div>
                </div>
              </div>
              
              <div className="pdp-supplier-details space-y-3 text-sm text-gray-600 mb-6">
                <div className="pdp-supplier-location flex items-center gap-2">
                  <span className="text-lg leading-none">🇩🇪</span> {product.supplier?.location || 'Germany, Berlin'}
                </div>
                <div className="pdp-verification-status flex items-center gap-2">
                  <Shield size={16} className="text-gray-400" /> Verified Supplier
                </div>
                <div className="pdp-shipping-info flex items-center gap-2">
                  <Globe size={16} className="text-gray-400" /> {product.supplier?.shipping || 'Worldwide shipping'}
                </div>
              </div>

              <div className="pdp-supplier-actions space-y-2">
                <button className="pdp-send-inquiry-button w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary-hover transition-colors">
                  Send inquiry
                </button>
                <button className="pdp-view-profile-button w-full bg-white text-primary border border-gray-300 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  Seller's profile
                </button>
              </div>
            </div>
            
            {/* Actions - Moved from product info section */}
            <div className="pdp-action-buttons hidden lg:flex flex-wrap items-center gap-4 mt-4">
              <div className="pdp-quantity-selector flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                <button 
                  className="pdp-quantity-decrease px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="pdp-quantity-value px-4 py-2 border-x border-gray-300 text-sm font-medium min-w-[50px] text-center">{quantity}</span>
                <button 
                  className="pdp-quantity-increase px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
              <button className="pdp-buy-now-button bg-primary text-white px-8 py-2.5 rounded-md font-medium hover:bg-primary-hover transition-colors shadow-sm">
                Buy now
              </button>
              <button 
                onClick={handleAdd}
                disabled={isAdding}
                className={`pdp-add-to-cart-button bg-white text-primary border border-gray-300 px-8 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 ${isAdding ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isAdding ? <LoadingSpinner size={20} /> : <ShoppingCart size={18} />}
                {isAdding ? '' : 'Add to cart'}
              </button>
              <button 
                onClick={() => {
                  setIsWishlistLoading(true);
                  setTimeout(() => setIsWishlistLoading(false), 900);
                }}
                disabled={isWishlistLoading}
                className={`pdp-wishlist-button bg-white text-primary border border-gray-300 p-2.5 rounded-md hover:bg-gray-50 transition-colors shadow-sm ${isWishlistLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isWishlistLoading ? <LoadingSpinner size={20} /> : <Heart size={20} />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Supplier Info */}
        <div className="pdp-mobile-supplier lg:hidden bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between">
          <div className="pdp-mobile-supplier-info flex items-center gap-3">
            <div className="pdp-mobile-supplier-logo w-10 h-10 bg-[#c6f3f1] text-[#4ca7a7] rounded-md flex items-center justify-center font-bold text-lg">
              R
            </div>
            <div className="pdp-mobile-supplier-details">
              <h3 className="pdp-mobile-supplier-name font-medium text-gray-900 text-sm">{product.supplier?.name || 'Supplier Name LLC'}</h3>
              <div className="pdp-mobile-supplier-location text-xs text-gray-500">{product.supplier?.location || 'Germany, Berlin'}</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Bottom Section: Tabs and Sidebar */}
        <div className="pdp-details-section flex flex-col lg:flex-row gap-6">
          
          {/* Main Content Area */}
          <div className="pdp-tabs-container flex-1 bg-white border border-gray-200 rounded-md overflow-hidden">
            {/* Tabs */}
            <div 
              className="pdp-tabs-list flex border-b border-gray-200 overflow-x-auto"
              onWheel={(e) => {
                if (e.shiftKey) {
                  e.currentTarget.scrollLeft += e.deltaY;
                  e.preventDefault();
                }
              }}
            >
              {['Description', 'Reviews', 'Shipping', 'About company'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pdp-tab-button px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.toLowerCase() 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="pdp-tab-content p-6">
              {activeTab === 'description' && (
                <div className="pdp-description-content space-y-6">
                  <div 
                    className="pdp-description-text text-gray-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  
                  {/* Details Table */}
                  <div className="pdp-specs-table border border-gray-200 rounded-md overflow-hidden max-w-2xl">
                    <table className="pdp-specs-table-element w-full text-sm text-left">
                      <tbody>
                        {Object.entries(product.detailsTable || product.specs).map(([key, value], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="pdp-spec-key px-4 py-2 border-r border-gray-200 text-gray-500 w-1/3">{key}</td>
                            <td className="pdp-spec-value px-4 py-2 text-gray-900">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Features List */}
                  <div className="pdp-features-section">
                    <h4 className="pdp-features-title font-medium text-gray-900 mb-3"><Check size={16} className="inline mr-2 text-gray-400" /> Some great feature name</h4>
                    <ul className="pdp-features-list space-y-2 text-sm text-gray-600">
                      {(product.features || ['Durable material', 'Lightweight design', 'Easy to use', 'Long lasting']).map((feature, idx) => (
                        <li key={idx} className="pdp-feature-item flex items-start gap-2">
                          <Check size={16} className="text-gray-400 mt-0.5" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="pdp-reviews-content space-y-6 max-w-2xl">
                  {/* Review Summary */}
                  <div className="pdp-reviews-summary flex items-center gap-6 border-b border-gray-200 pb-4">
                    <div className="pdp-reviews-average text-center">
                      <div className="text-4xl font-bold text-gray-900">{product.rating?.toFixed(1)}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{product.reviews} reviews</div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {product.reviewDetails && product.reviewDetails.length > 0 ? (
                    <div className="pdp-reviews-list space-y-6">
                      {product.reviewDetails.map((review) => (
                        <div key={review.id} className="pdp-review-item border-b border-gray-100 pb-4 last:border-0">
                          <div className="pdp-review-header flex items-center justify-between mb-2">
                            <div className="pdp-review-author flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {review.author.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{review.author}</div>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        size={14}
                                        className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="pdp-review-comment text-gray-600 text-sm leading-relaxed mt-3">
                            {review.comment}
                          </p>
                          {review.helpful && (
                            <div className="pdp-review-helpful mt-2 text-sm text-gray-500">
                              {review.helpful} people found this helpful
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pdp-no-reviews text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this product!
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="pdp-shipping-content space-y-6">
                  <div className="pdp-delivery-info border border-gray-200 rounded-md p-4 max-w-2xl">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Truck size={18} /> Delivery Information
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Estimated Delivery:</span> {product.deliveryTiming || '7-15 days'}</p>
                      <p><span className="font-medium">Shipping Method:</span> {product.freeShipping ? 'Free Shipping' : 'Standard Shipping'}</p>
                      <p><span className="font-medium">Shipping Area:</span> {product.supplier?.shipping || 'Worldwide'}</p>
                    </div>
                  </div>
                  
                  <div className="pdp-shipping-notice bg-blue-50 border border-blue-200 rounded-md p-4 max-w-2xl">
                    <p className="text-sm text-blue-800">
                      Delivery times may vary depending on the destination and product availability. 
                      For customized orders or bulk purchases, delivery times may be longer.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'about company' && (
                <div className="pdp-about-company-content space-y-6 max-w-2xl">
                  {product.companyInfo ? (
                    <>
                      {/* Company Description */}
                      <div className="pdp-company-description border-b border-gray-200 pb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{product.supplier?.name || 'Company'}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {product.companyInfo.description}
                        </p>
                      </div>

                      {/* Company Stats */}
                      <div className="pdp-company-stats grid grid-cols-2 gap-4">
                        <div className="pdp-stat-item bg-gray-50 rounded-md p-4">
                          <div className="text-sm text-gray-500">Founded</div>
                          <div className="font-medium text-gray-900">{product.companyInfo.founded}</div>
                        </div>
                        <div className="pdp-stat-item bg-gray-50 rounded-md p-4">
                          <div className="text-sm text-gray-500">Employees</div>
                          <div className="font-medium text-gray-900">{product.companyInfo.employees}</div>
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="pdp-certifications">
                        <h5 className="font-medium text-gray-900 mb-3">Certifications</h5>
                        <div className="flex flex-wrap gap-2">
                          {product.companyInfo.certifications.map((cert, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Export History */}
                      <div className="pdp-export bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h5 className="font-medium text-blue-900 mb-1">Global Presence</h5>
                        <p className="text-sm text-blue-800">{product.companyInfo.exportHistory}</p>
                      </div>

                      {/* Verified Supplier Badge */}
                      {product.supplier?.verified && (
                        <div className="pdp-verified flex items-center gap-2 text-green-600">
                          <Shield size={18} />
                          <span className="font-medium">Verified Supplier</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <h4 className="font-medium text-gray-900 mb-2">{product.supplier?.name || 'Supplier'}</h4>
                      <p className="text-sm mb-4">Location: {product.supplier?.location || 'N/A'}</p>
                      {product.supplier?.verified && (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Shield size={18} />
                          <span className="font-medium">Verified Supplier</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {activeTab !== 'description' && activeTab !== 'shipping' && activeTab !== 'reviews' && activeTab !== 'about company' && (
                <div className="pdp-empty-tab-content py-12 text-center text-gray-500">
                  Content for {activeTab} will be displayed here.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: You may like */}
          <div className="pdp-recommendations-sidebar w-full lg:w-72 flex-shrink-0 bg-white border border-gray-200 rounded-md p-4">
            <h3 className="pdp-recommendations-title font-bold text-gray-900 mb-4">You may like</h3>
            <div className="pdp-recommendations-list grid grid-cols-2 lg:grid-cols-1 gap-4">
              {PRODUCTS.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="pdp-recommended-product flex flex-col lg:flex-row gap-3 group">
                  <div className="pdp-recommended-product-image w-full lg:w-20 aspect-square lg:h-20 border border-gray-200 rounded-md bg-gray-50 flex-shrink-0 overflow-hidden">
                    <img src={Array.isArray(p.image) ? p.image[0] : p.image} alt={p.title} className="pdp-recommended-image w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div className="pdp-recommended-product-info flex flex-col justify-center">
                    <h4 className="pdp-recommended-product-title text-xs lg:text-sm text-gray-900 font-medium line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h4>
                    <span className="pdp-recommended-product-price text-gray-500 text-xs lg:text-sm mt-1">${p.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Actions */}
      <div className="pdp-mobile-actions lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-40">
        <button className="pdp-mobile-inquiry-button flex-1 bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary-hover transition-colors">
          Send inquiry
        </button>
        <button 
          onClick={handleAdd}
          disabled={isAdding}
          className="pdp-mobile-cart-button flex-1 bg-white text-primary border border-gray-300 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          {isAdding ? 'Adding...' : 'Add to cart'}
        </button>
      </div>
      <div className="pdp-mobile-spacer lg:hidden h-20" /> {/* Spacer for sticky bottom */}
    </motion.div>
    </>
  );
}
