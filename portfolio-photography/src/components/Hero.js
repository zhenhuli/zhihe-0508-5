import React, { useState, useEffect } from 'react';
import { heroImages } from '../data/photos';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="home" 
      className="vh-100 relative overflow-hidden flex items-center justify-center"
    >
      {heroImages.map((img, index) => (
        <div
          key={index}
          className="absolute top-0 left-0 w-100 h-100"
          style={{
            opacity: index === currentImage ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      <div 
        className="absolute top-0 left-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />

      <div className="relative z-1 tc ph3 ph4-l">
        <h1 className="hero-text f2 f1-l fw1 white mv4 lh-title">
          用镜头捕捉
          <br />
          <span className="fw7">每一个精彩瞬间</span>
        </h1>
        <p className="hero-text f5 f4-l light-silver mv4 mw7 center lh-copy">
          专业摄影师，专注人像、风景、街拍摄影，用光影讲述故事
        </p>
        <button
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          className="hero-text pa3 ph5 bg-white black bn pointer f5 fw6 hover-bg-light-silver"
          style={{ transition: 'all 0.3s ease' }}
        >
          浏览作品
        </button>
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className="br-100 pa0 pointer"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: index === currentImage ? '#fff' : 'rgba(255,255,255,0.3)',
              border: 'none',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
