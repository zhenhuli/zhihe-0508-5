import React from 'react';
import { useLazyLoad } from '../hooks/useLazyLoad';

const LazyImage = ({ src, alt, className = '' }) => {
  const { imgRef, isLoaded } = useLazyLoad();

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={isLoaded ? src : ''}
        alt={alt}
        className={`w-full h-full object-cover lazy-image ${isLoaded ? 'loaded' : ''}`}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImage;
