import React, { useState, useEffect } from 'react';

const PhotoPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop',
      caption: '我们的故事'
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop',
      caption: '甜蜜时光'
    },
    {
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=1200&fit=crop',
      caption: '幸福时刻'
    },
    {
      url: 'https://images.unsplash.com/photo-1522673607250-266ee388579b?w=800&h=1200&fit=crop',
      caption: '爱的见证'
    },
    {
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1200&fit=crop',
      caption: '永远在一起'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="w-100 h-100 relative overflow-hidden bg-washed-pink">
      <div className="absolute top-0 left-0 w-100 h-100 z-0">
        <img
          src={photos[currentIndex].url}
          alt={photos[currentIndex].caption}
          className="w-100 h-100 object-cover"
        />
        <div className="absolute top-0 left-0 w-100 h-100" style={{
          background: 'linear-gradient(to bottom, rgba(255,182,193,0.3) 0%, rgba(255,105,180,0.1) 50%, rgba(255,192,203,0.4) 100%)'
        }} />
      </div>

      <div className="relative z-1 w-100 h-100 flex flex-column">
        <div className="tc pt5 pb3">
          <h2 className="f3 f2-m dark-pink ma0" style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
            💑 婚纱照
          </h2>
          <p className="f5 light-pink mt2 ma0" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
            {photos[currentIndex].caption}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px3">
          <div className="relative w-100 max-w-sm overflow-hidden br3 shadow-3 bg-white" style={{ height: '60vh' }}>
            <div
              className="flex transition-transform duration-700 ease-in-out h-100"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {photos.map((photo, index) => (
                <div key={index} className="w-100 flex-shrink-0 h-100">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-100 h-100 object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={goToPrevious}
              className="absolute top-50 left-2 transform translateY--50 bg-white-80 hover-bg-white bn br-100 w2 h2 w3-m h3-m flex items-center justify-center pointer shadow-1 transition-all"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <span className="f5 f4-m b dark-pink">‹</span>
            </button>

            <button
              onClick={goToNext}
              className="absolute top-50 right-2 transform translateY--50 bg-white-80 hover-bg-white bn br-100 w2 h2 w3-m h3-m flex items-center justify-center pointer shadow-1 transition-all"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <span className="f5 f4-m b dark-pink">›</span>
            </button>
          </div>
        </div>

        <div className="pb4 tc">
          <div className="flex items-center justify-center gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w2 h2 br-100 bn transition-all ${
                  index === currentIndex ? 'bg-hot-pink scale-125' : 'bg-white-60'
                }`}
              />
            ))}
          </div>
          <p className="f6 light-pink mt3">左右滑动查看更多照片</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoPage;
