import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookImage from '../assets/banner-books/awardbooks.png';

const PromoBanner = () => {
  const [promoCode, setPromoCode] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const generatePromoCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPromoCode(result);
    setCopyMessage('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setCopyMessage('Copied!');
    setTimeout(() => setCopyMessage(''), 2000);
  };

  return (
    <div className="mt-16 py-12 px-4 lg:px-24 bg-pink-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-6 leading-snug">
            2023 National Book Awards for Fiction Shortlist
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={generatePromoCode}
              className="bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300"
            >
              Get Promo Code
            </button>
            <div className="relative flex items-center">
              <input
                type="text"
                value={promoCode}
                readOnly
                className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded px-4 py-2 w-36 focus:outline-none"
                placeholder="XXXXXX"
              />
              {promoCode && (
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 text-gray-500 hover:text-gray-700 text-sm"
                  title="Copy to clipboard"
                >
                  copy
                </button>
              )}
            </div>
            {copyMessage && (
              <span className="text-sm text-green-600">{copyMessage}</span>
            )}
          </div>
        </div>
        <div>
          <img src={bookImage} alt="Books" className="w-96" />
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;