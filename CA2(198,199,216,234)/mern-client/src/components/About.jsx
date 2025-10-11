import React, { useEffect, useState } from 'react';

const About = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  const totalAmount = cartItems.length * 10;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowThankYou(true);
      
      // Clear cart after purchase
      localStorage.removeItem('cartItems');
      setCartItems([]);
      
      // Hide thank you message after 5 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="mt-28 mb-32 px-4 lg:px-24">
      {showThankYou && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-8 py-4 rounded-lg shadow-lg z-50 text-center">
          <h3 className="text-xl font-bold mb-2">Thank you for your purchase! 📚</h3>
          <p>Your books will be delivered with love! 💝</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Left side - Books list */}
        <div className="lg:w-2/3 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            cartItems.map((book) => (
              <div key={book._id} className="flex gap-6 items-center border-b pb-6">
                <img 
                  src={book.imageUrl} 
                  alt={book.bookTitle}
                  className="w-32 h-40 object-cover rounded-lg shadow-md"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{book.bookTitle}</h3>
                  <p className="text-blue-600 font-bold">Price: $10</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right side - Total amount */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-28">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold mb-6">
                <span>Total Amount:</span>
                <span>${totalAmount}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200
                  ${cartItems.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isProcessing 
                      ? 'bg-blue-400 cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;