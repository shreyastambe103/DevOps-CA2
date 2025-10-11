import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 25 }) => {
  const totalStars = 5;

  return (
    <div className="flex text-amber-500 gap-3">
      {[...Array(totalStars)].map((_, index) => (
        index < rating ? (
          <FaStar key={index} size={size} />
        ) : (
          <FaRegStar key={index} size={size} />
        )
      ))}
    </div>
  );
};

export default StarRating;
