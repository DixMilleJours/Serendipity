import React from 'react';
import Maldive from '../../static/images/maldive.jpg'
import NewYork from '../../static/images/newyork.webp'

const images = [
    Maldive,
    NewYork
  // Add as many images as you like
];

const StackedPictures = () => {
  return (
    <div className="stacked-pictures">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Stacked image ${index}`}
          style={{
            transform: `translateX(${index * 10}px) translateY(${index * 10}px) rotate(${index * 2}deg)`,
            zIndex: images.length - index,
          }}
          className="stacked-picture"
        />
      ))}
    </div>
  );
};

export default StackedPictures;
