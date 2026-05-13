import React from 'react';

const HomePage = () => {
  return (
    <div className="w-100 h-100 flex flex-column items-center justify-center relative overflow-hidden bg-light-pink">
      <div className="absolute top-0 left-0 w-100 h-100" style={{
        background: 'linear-gradient(180deg, #FFE4E9 0%, #FFC0CB 50%, #FFB6C1 100%)'
      }} />

      <div className="absolute top-5 left-5">
        <span className="f1" style={{ fontSize: '3rem' }}>💒</span>
      </div>
      <div className="absolute top-5 right-5">
        <span className="f1" style={{ fontSize: '3rem' }}>💕</span>
      </div>
      <div className="absolute bottom-20 left-5">
        <span className="f1" style={{ fontSize: '2.5rem' }}>💍</span>
      </div>
      <div className="absolute bottom-20 right-5">
        <span className="f1" style={{ fontSize: '2.5rem' }}>🌹</span>
      </div>

      <div className="relative z-1 tc ph4">
        <div className="mb5">
          <div className="dib ba b--white bg-white-80 br-100 pa4 shadow-3" style={{ background: 'rgba(255,255,255,0.3)' }}>
            <span style={{ fontSize: '4rem' }}>👰</span>
            <span className="ml3" style={{ fontSize: '4rem' }}>🤵</span>
          </div>
        </div>

        <h1 className="f2 f1-l dark-pink ma0 mb3" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(255,255,255,0.5)' }}>
          张先生
        </h1>
        <div className="flex items-center justify-center gap-2 my3">
          <span className="dark-pink" style={{ fontSize: '1.5rem' }}>💕</span>
          <span className="f4 light-pink b">AND</span>
          <span className="dark-pink" style={{ fontSize: '1.5rem' }}>💕</span>
        </div>
        <h1 className="f2 f1-l dark-pink ma0" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(255,255,255,0.5)' }}>
          李小姐
        </h1>

        <div className="mt5">
          <p className="f4 dark-pink ma0 mb2" style={{ fontFamily: 'Georgia, serif' }}>
            我们要结婚啦！
          </p>
          <p className="f5 light-pink ma0" style={{ fontFamily: 'Georgia, serif' }}>
            2026.10.01
          </p>
        </div>

        <div className="mt4 dib ba b--hot-pink br-pill ph4 pv2 bg-white-50">
          <span className="f5 hot-pink b">
            💕 诚挚邀请您见证 💕
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-5 flex flex-column items-center"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="f6 light-pink mb2">向上滑动</span>
        <span className="animate-bounce f3 hot-pink">↾</span>
      </div>
    </div>
  );
};

export default HomePage;
