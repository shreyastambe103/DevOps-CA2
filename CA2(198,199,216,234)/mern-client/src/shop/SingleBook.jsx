import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

const SingleBook = () => {
  const { _id, bookTitle, imageUrl, bookDescription, authorName } = useLoaderData();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    // Store book details in localStorage to persist between pages
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push({ _id, bookTitle, imageUrl, price: 10 }); // Adding fixed price of 10
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/about');
  };

  return (
    <div className="mt-28 mb-32 px-4 lg:px-24">
      {/* Book Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-7 text-gray-800">
        {bookTitle}
      </h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        by {authorName}
      </p>
      
      {/* Book Content Container */}
      <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
        {/* Book Image */}
        <div className="md:w-1/3">
          <img 
            src={imageUrl} 
            alt={bookTitle}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
        
        {/* Book Details */}
        <div className="md:w-2/3 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About this Book</h2>
              <p className="text-gray-600 leading-relaxed">
                {bookDescription}
              </p>
            </div>
          </div>
          
          {/* Buy Button */}
          <button 
            onClick={handleBuyNow}
            className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold w-full md:w-auto"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;