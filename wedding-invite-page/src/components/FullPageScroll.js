import React, { useState, useRef, useEffect, useCallback } from 'react';

const FullPageScroll = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const totalPages = React.Children.count(children);

  const goToPage = useCallback((pageIndex) => {
    if (isAnimating) return;
    if (pageIndex < 0 || pageIndex >= totalPages) return;

    setIsAnimating(true);
    setCurrentPage(pageIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, totalPages]);

  const goNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goPrev = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [goNext, goPrev]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div
      ref={containerRef}
      className="w-100 h-100 overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div
        className="transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateY(-${currentPage * 100}vh)`,
          height: `${totalPages * 100}vh`
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div className="w-100 h-vh-100" key={index}>
            {child}
          </div>
        ))}
      </div>

      <div
        className="fixed right-3 flex flex-column gap-2 z-999"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`w2 h2 br-100 bn transition-all duration-300 pa0 ${
              index === currentPage
                ? 'bg-hot-pink scale-125'
                : 'bg-white-50 hover-bg-white-70'
            }`}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      {currentPage < totalPages - 1 && (
        <div
          className="fixed bottom-4 z-999 animate-bounce"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <span className="f3 white-80">↾</span>
        </div>
      )}
    </div>
  );
};

export default FullPageScroll;
