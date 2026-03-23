import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { saveOrder } from './ordersDb';

const InputField = ({ 
  label, 
  type = 'text', 
  error, 
  required = true,
  value,
  onChange,
  maxLength,
  placeholder
}: { 
  label: string, 
  type?: string, 
  error?: string, 
  required?: boolean,
  value?: string,
  onChange?: (value: string) => void,
  maxLength?: number,
  placeholder?: string
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <div
        className={`relative h-12 border transition-colors ${
          error ? 'border-red-500' : focused ? 'border-primary' : 'border-border'
        }`}
      >
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none font-body uppercase tracking-widest ${
            focused || value
              ? 'top-1 text-[10px] text-muted'
              : 'top-1/2 -translate-y-1/2 text-sm text-muted'
          }`}
        >
          {label} {required && '*'}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full h-full pt-4 px-4 bg-transparent outline-none font-body text-sm text-primary"
        />
      </div>
      {error && (
        <p className="absolute -bottom-5 left-0 text-[12px] text-red-500 font-body uppercase tracking-widest">
          {error}
        </p>
      )}
    </div>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, orderNumber }: { isOpen: boolean; onClose: () => void; orderNumber: string }) => {
  const navigate = useNavigate();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="font-display text-2xl uppercase tracking-tight mb-2">Payment Successful!</h2>
            <p className="text-muted font-body mb-4">Thank you for your purchase</p>
            
            <div className="bg-gray-50 rounded p-4 mb-6">
              <p className="text-sm text-muted uppercase tracking-widest mb-1">Order Number</p>
              <p className="font-medium font-body">{orderNumber}</p>
            </div>
            
            <p className="text-sm text-muted font-body mb-6">
              A confirmation email has been sent to your email address. 
              Your order will be processed and shipped within 2-3 business days.
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="w-full h-12 bg-primary text-white font-body text-sm font-medium uppercase tracking-widest hover:bg-surface hover:text-primary border border-primary transition-colors"
            >
              Continue Shopping
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiryDate?: string;
    securityCode?: string;
    nameOnCard?: string;
  }>({});
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  
  // Validate payment form
  const validatePayment = () => {
    const newErrors: typeof errors = {};
    
    // Card number validation (16 digits)
    const cardNum = cardNumber.replace(/\s/g, '');
    if (!cardNum) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNum.length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    
    // Expiry date validation (MM/YY format, not expired)
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Use MM/YY format';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const now = new Date();
      const expYear = 2000 + year;
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (expYear < now.getFullYear() || (expYear === now.getFullYear() && month < now.getMonth() + 1)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // Security code validation (3-4 digits)
    if (!securityCode) {
      newErrors.securityCode = 'Security code is required';
    } else if (!/^\d{3,4}$/.test(securityCode)) {
      newErrors.securityCode = 'Enter 3 or 4 digit CVV';
    }
    
    // Name on card validation
    if (!nameOnCard.trim()) {
      newErrors.nameOnCard = 'Name on card is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle payment processing
  const handlePayment = async () => {
    if (!validatePayment()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate order number
    const newOrderNumber = 'ZIN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setOrderNumber(newOrderNumber);
    
    // Save order to IndexedDB
    const order = {
      orderNumber: newOrderNumber,
      items: cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: Array.isArray(item.image) ? item.image[0] : item.image
      })),
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'processing' as const
    };
    
    try {
      await saveOrder(order);
    } catch (error) {
      console.error('Failed to save order:', error);
    }
    
    // Clear cart and show success modal
    clearCart();
    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex justify-center"
    >
      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row gap-12 p-6 lg:p-12">
        {/* Main Form Area */}
        <div className="flex-1 max-w-[600px] mx-auto w-full">
          <div className="mb-12">
            <Link to="/" className="font-display font-medium text-xl tracking-tight uppercase">
              Zintago
            </Link>
          </div>

          <div className="space-y-8">
            {/* Step 1: Shipping */}
            <div className="border-t border-border pt-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setStep(1)}
              >
                <h2 className={`font-display text-2xl uppercase tracking-tight ${step === 1 ? 'text-primary' : 'text-muted'}`}>
                  1. Shipping
                </h2>
                {step === 2 && (
                  <button className="text-sm uppercase tracking-widest text-muted hover:text-primary">
                    Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {step === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="First Name" />
                        <InputField label="Last Name" />
                      </div>
                      <InputField label="Address" />
                      <InputField label="Apartment, suite, etc. (optional)" required={false} />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <InputField label="City" />
                        </div>
                        <div className="col-span-1">
                          <InputField label="State" />
                        </div>
                        <div className="col-span-1">
                          <InputField label="ZIP" />
                        </div>
                      </div>
                      <InputField label="Phone" type="tel" />
                      
                      <button
                        onClick={() => setStep(2)}
                        className="w-full h-14 bg-primary text-background font-body text-sm font-medium uppercase tracking-widest hover:bg-surface hover:text-primary border border-primary transition-colors mt-8"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: Payment */}
            <div className="border-t border-border pt-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => step === 2 && setStep(2)}
              >
                <h2 className={`font-display text-2xl uppercase tracking-tight ${step === 2 ? 'text-primary' : 'text-muted'}`}>
                  2. Payment
                </h2>
              </div>

              <AnimatePresence>
                {step === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 space-y-4">
                      <InputField 
                        label="Card Number" 
                        value={cardNumber}
                        onChange={(val) => setCardNumber(formatCardNumber(val))}
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        error={errors.cardNumber}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField 
                          label="Expiration Date (MM/YY)" 
                          value={expiryDate}
                          onChange={(val) => setExpiryDate(formatExpiryDate(val))}
                          maxLength={5}
                          placeholder="MM/YY"
                          error={errors.expiryDate}
                        />
                        <InputField 
                          label="Security Code" 
                          value={securityCode}
                          onChange={(val) => setSecurityCode(val.replace(/[^0-9]/g, ''))}
                          maxLength={4}
                          placeholder="123"
                          error={errors.securityCode}
                        />
                      </div>
                      <InputField 
                        label="Name on Card" 
                        value={nameOnCard}
                        onChange={setNameOnCard}
                        error={errors.nameOnCard}
                      />

                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-14 bg-primary text-background font-body text-sm font-medium uppercase tracking-widest hover:bg-surface hover:text-primary border border-primary transition-colors mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <LoadingSpinner size={18} />
                            <span>Processing...</span>
                          </>
                        ) : (
                          `Pay $${cartTotal.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="sticky top-12 border border-border bg-surface p-6">
            <h3 className="font-display text-lg uppercase tracking-tight mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted uppercase tracking-widest">
                    {item.quantity}x {item.title}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm uppercase tracking-widest text-muted">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest text-muted">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm uppercase tracking-widest text-muted">
                <span>Taxes</span>
                <span>Calculated</span>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-medium uppercase tracking-widest">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        orderNumber={orderNumber}
      />
    </motion.div>
  );
}
