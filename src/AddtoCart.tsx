import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { ArrowLeft, ShieldCheck, MessageSquare, Truck, Trash2 } from 'lucide-react';

export default function ShoppingCartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  // Dynamic calculations
  const subtotal = cartTotal;
  
  // Sample coupon discounts (in a real app, this would come from an API)
  const couponDiscounts: Record<string, number> = {
    'SAVE10': 10,
    'SAVE20': 20,
    'WELCOME15': 15,
  };
  
  // Calculate discount based on applied coupon
  const discount = appliedCoupon ? (couponDiscounts[appliedCoupon] || 0) : 0;
  const discountAmount = (subtotal * discount) / 100;
  
  // Calculate tax (e.g., 8% tax rate)
  const taxRate = 0.08;
  const tax = (subtotal - discountAmount) * taxRate;
  
  const total = subtotal - discountAmount + tax;

  // Handle coupon application
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (couponDiscounts[code]) {
      setAppliedCoupon(code);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Handle remove all
  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  // Generate dynamic quantity options based on cart item quantity (max 10 or quantity + 5)
  const getQuantityOptions = (currentQty: number) => {
    const maxQty = Math.max(10, currentQty + 5);
    return Array.from({ length: Math.min(maxQty, 20) }, (_, i) => i + 1);
  };

  // Feature descriptions (could be moved to constants or i18n)
  const features = [
    { icon: ShieldCheck, title: 'Secure Payment', desc: 'Your payment information is encrypted and secure' },
    { icon: MessageSquare, title: 'Customer Support', desc: '24/7 dedicated customer support team' },
    { icon: Truck, title: 'Free Delivery', desc: 'Free shipping on orders over $50' },
  ];

  // Payment method icons using images
  const paymentMethods = [
    { name: 'Visa', img: 'https://logos-world.net/wp-content/uploads/2020/05/Visa-Logo.png' },
    { name: 'Mastercard', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png' },
    { name: 'PayPal', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png' },
    { name: 'AmericaExpress', img: 'https://pentagram-production.imgix.net/de996aa4-5343-4200-a466-ab8fc7eafa80/am_amex_01.jpg?auto=compress%2Cformat&crop=entropy&fit=crop&fm=jpg&h=470&q=80&rect=0%2C172%2C3000%2C1875&w=900' },
  ];

  return (
    <div className="addtocart-page bg-[#f7f8fa] min-h-screen py-8 font-sans">
      <div className="addtocart-container max-w-[1180px] mx-auto px-4">
        <h1 className="addtocart-title text-[24px] font-bold text-[#1c1c1c] mb-6">My cart ({cartItems.length})</h1>

        <div className="addtocart-content flex flex-col lg:flex-row gap-5">
          {/* Left Column - Main Content */}
          <div className="addtocart-left lg:w-[75%]">
            
            {/* Cart Items List Container */}
            <div className="addtocart-items-container bg-white border border-[#e3e8ee] rounded-md mb-4">
              {cartItems.length === 0 ? (
                <div className="addtocart-empty p-10 text-center">
                  <p className="addtocart-empty-text text-[#8b96a5] text-lg mb-4">Your cart is empty</p>
                  <Link to="/products" className="addtocart-continue-shopping text-[#0d6efd] font-medium hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`addtocart-item flex flex-col sm:flex-row gap-4 p-5 ${
                      index !== cartItems.length - 1 ? 'addtocart-item-border border-b border-[#e3e8ee]' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className="addtocart-item-image-wrapper flex-shrink-0">
                      <div className="addtocart-item-image-container w-[80px] h-[80px] border border-[#e3e8ee] rounded-md flex items-center justify-center p-2 bg-white">
                        <img 
                          src={Array.isArray(item.image) ? item.image[0] : item.image} 
                          alt={item.title} 
                          className="addtocart-item-image max-w-full max-h-full object-contain" 
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="addtocart-item-details flex-1 flex flex-col sm:flex-row justify-between">
                      <div className="addtocart-item-info flex flex-col pr-4">
                        <h3 className="addtocart-item-title font-medium text-[#1c1c1c] mb-1 leading-snug">{item.title}</h3>
                        <p className="addtocart-item-price text-[13px] text-[#8b96a5] mb-3">
                          ${item.price.toFixed(2)} each
                        </p>
                        
                        <div className="addtocart-item-actions flex gap-2 mt-auto">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="addtocart-remove-btn text-[#fa3434] border border-[#e3e8ee] hover:bg-gray-50 px-3 py-1.5 rounded text-[13px] font-medium shadow-sm transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                          <button className="addtocart-save-btn text-[#0d6efd] border border-[#e3e8ee] hover:bg-gray-50 px-3 py-1.5 rounded text-[13px] font-medium shadow-sm transition-colors">
                            Save for later
                          </button>
                        </div>
                      </div>

                      {/* Price and Qty */}
                      <div className="addtocart-item-qty-price flex flex-row sm:flex-col justify-between items-center sm:items-end mt-4 sm:mt-0 min-w-[100px]">
                        <span className="addtocart-item-total font-bold text-[18px] text-[#1c1c1c]">${(item.price * item.quantity).toFixed(2)}</span>
                        <div className="addtocart-quantity-wrapper mt-2">
                           <select 
                              className="addtocart-quantity-select border border-[#e3e8ee] rounded p-1.5 px-3 text-[14px] text-[#1c1c1c] bg-white outline-none focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                           >
                              {getQuantityOptions(item.quantity).map(qty => (
                                <option key={qty} value={qty}>Qty: {qty}</option>
                              ))}
                           </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions Bar */}
            <div className="addtocart-actions-bar bg-white border border-[#e3e8ee] rounded-md p-4 flex justify-between items-center mb-6">
              <Link to="/products" className="addtocart-back-btn bg-[#0d6efd] text-white px-4 py-2 rounded shadow-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors text-[15px]">
                <ArrowLeft size={18} /> Back to shop
              </Link>
              <button 
                onClick={handleRemoveAll}
                className="addtocart-remove-all-btn text-[#0d6efd] font-medium hover:underline text-[15px]"
                disabled={cartItems.length === 0}
              >
                Remove all
              </button>
            </div>

            {/* Features/Guarantees Section */}
            <div className="addtocart-features flex flex-wrap gap-y-4 gap-x-8 pb-10">
              {features.map((feature, index) => (
                <div key={index} className="addtocart-feature-item flex items-center gap-3">
                  <div className="addtocart-feature-icon w-[48px] h-[48px] bg-[#e3e8ee] rounded-full flex items-center justify-center text-[#8b96a5]">
                    <feature.icon size={24} />
                  </div>
                  <div className="addtocart-feature-content">
                    <p className="addtocart-feature-title font-medium text-[#1c1c1c] text-[15px]">{feature.title}</p>
                    <p className="addtocart-feature-desc text-[13px] text-[#8b96a5]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="addtocart-right lg:w-[25%] space-y-4">
            
            {/* Coupon Section */}
            <div className="addtocart-coupon bg-white border border-[#e3e8ee] rounded-md p-4 shadow-sm">
              <p className="addtocart-coupon-label text-[15px] text-[#1c1c1c] mb-3">Have a coupon?</p>
              {appliedCoupon ? (
                <div className="addtocart-applied-coupon flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                  <span className="addtocart-applied-code text-green-700 font-medium text-sm">
                    {appliedCoupon} (-{discount}%)
                  </span>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="addtocart-remove-coupon text-green-700 hover:text-green-900 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="addtocart-coupon-input-wrapper flex">
                    <input 
                      type="text" 
                      placeholder="Add coupon" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="addtocart-coupon-input flex-1 border border-[#e3e8ee] border-r-0 rounded-l p-2 outline-none text-[14px] focus:border-blue-400 placeholder-[#8b96a5]" 
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="addtocart-coupon-apply border border-[#e3e8ee] border-l-0 rounded-r px-4 text-[#0d6efd] bg-white text-[14px] font-medium hover:bg-gray-50 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="addtocart-coupon-error text-red-500 text-xs mt-2">{couponError}</p>
                  )}
                  <p className="addtocart-coupon-hint text-[#8b96a5] text-xs mt-2">
                    Try: SAVE10, SAVE20, WELCOME15
                  </p>
                </>
              )}
            </div>

            {/* Total Summary Section */}
            <div className="addtocart-summary bg-white border border-[#e3e8ee] rounded-md p-4 shadow-sm">
              <div className="addtocart-summary-rows space-y-3 border-b border-[#e3e8ee] pb-4 text-[15px]">
                <div className="addtocart-subtotal-row flex justify-between">
                  <span className="addtocart-subtotal-label text-[#505050]">Subtotal:</span>
                  <span className="addtocart-subtotal-value text-[#505050] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="addtocart-discount-row flex justify-between text-[#00b517]">
                    <span className="addtocart-discount-label">Discount ({appliedCoupon}):</span>
                    <span className="addtocart-discount-value">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="addtocart-tax-row flex justify-between text-[#8b96a5]">
                  <span className="addtocart-tax-label">Tax ({(taxRate * 100).toFixed(0)}%):</span>
                  <span className="addtocart-tax-value">+ ${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="addtocart-total-row flex justify-between items-center pt-4 mb-5">
                <span className="addtocart-total-label font-bold text-[#1c1c1c] text-[16px]">Total:</span>
                <span className="addtocart-total-value font-bold text-[20px] text-[#1c1c1c]">${total.toFixed(2)}</span>
              </div>
              
              <Link 
                to="/checkout" 
                className={`addtocart-checkout-btn w-full text-white font-medium text-[16px] py-3.5 rounded-md shadow-sm transition-colors inline-block text-center ${
                  cartItems.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed pointer-events-none' 
                    : 'bg-[#00b517] hover:bg-[#00a014]'
                }`}
              >
                Checkout
              </Link>
              
              {/* Payment Method Icons */}
              <div className="addtocart-payment-methods flex justify-center gap-2 mt-4">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index} 
                    className="addtocart-payment-icon w-14 h-9 bg-white rounded border border-[#e3e8ee] flex items-center justify-center p-1"
                    title={method.name}
                  >
                    <img src={method.img} alt={method.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
