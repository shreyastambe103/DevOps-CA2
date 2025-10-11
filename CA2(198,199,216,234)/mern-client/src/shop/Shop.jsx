import React, { useEffect, useState } from 'react';
import { Card } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

// Toast Notification Component
const Toast = ({ message, onClose }) => (
  <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down flex items-center gap-3">
    <span>✨ {message}</span>
    <button 
      onClick={onClose}
      className="ml-3 text-green-800 hover:text-green-900"
    >
      ×
    </button>
  </div>
);

const ExpandableCard = ({ book, onAddToCart }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  const truncatedText = book.bookDescription.slice(0, maxLength);
  const shouldShowReadMore = book.bookDescription.length > maxLength;

  const handleBuyNow = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push({
      _id: book._id,
      bookTitle: book.bookTitle,
      imageUrl: book.imageUrl,
      price: 10
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    onAddToCart(`"${book.bookTitle}" added to cart!`);
    setTimeout(() => {
      navigate('/about');
    }, 1500); 
  };

  return (
    <Card className="relative flex flex-col h-full">
      <div className="h-96 overflow-hidden">
        <img 
          src={book.imageUrl} 
          alt={book.bookTitle}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          {book.bookTitle}
        </h5>
        
        <div className="flex-grow">
          <p className="text-gray-700">
            {isExpanded ? book.bookDescription : truncatedText}
            {!isExpanded && shouldShowReadMore && "..."}
          </p>
          
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>

        <div className="text-lg font-semibold text-blue-600 mt-4 mb-2">
          Price: $10
        </div>
        
        <button 
          className="w-full bg-blue-700 text-white font-semibold py-2 rounded mt-2 hover:bg-blue-800 transition-colors"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </Card>
  );
};

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5500/all-books")
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  const handleAddToCart = (message) => {
    setToast(message);
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <div className="mt-28 px-4 lg:px-24">
      {toast && (
        <Toast 
          message={toast} 
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-5xl font-bold text-center">All Books are here</h2>
      
      <div className="grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1">
        {books.map(book => (
          <ExpandableCard 
            key={book._id} 
            book={book} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Shop;