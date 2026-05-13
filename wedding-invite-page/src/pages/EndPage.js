import React from 'react';

const EndPage = () => {
  return (
    <div className="w-100 h-100 flex flex-column items-center justify-center relative overflow-hidden bg-light-pink">
      <div className="absolute top-0 left-0 w-100 h-100" style={{
        background: 'linear-gradient(180deg, #FFC0CB 0%, #FFB6C1 50%, #FF69B4 100%)'
      }} />

      <div className="absolute top-5 left-5">
        <span style={{ fontSize: '2.5rem' }}>💖</span>
      </div>
      <div className="absolute top-5 right-5">
        <span style={{ fontSize: '2.5rem' }}>💝</span>
      </div>
      <div className="absolute bottom-20 left-5">
        <span style={{ fontSize: '2rem' }}>💐</span>
      </div>
      <div className="absolute bottom-20 right-5">
        <span style={{ fontSize: '2rem' }}>🎊</span>
      </div>

      <div className="relative z-1 tc ph4">
        <div className="mb5">
          <div className="dib ba b--white bg-white-40 br-100 pa4 shadow-3" style={{ background: 'rgba(255,255,255,0.3)' }}>
            <span style={{ fontSize: '4rem' }}>💕</span>
          </div>
        </div>

        <h2 className="f2 f1-l white ma0 mb3" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          感谢您的到来
        </h2>

        <p className="f4 white-90 ma0 mb4" style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
          期待与您共度美好时刻
        </p>

        <div className="mb4">
          <div className="dib ba b--white bg-white-30 br-pill ph4 pv3">
            <p className="f5 white b ma0">
              📅 2026年10月1日 中午12:00
            </p>
            <p className="f6 white-90 ma0 mt1">
              📍 喜来登大酒店 · 宴会厅
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt4">
          <span style={{ fontSize: '2rem' }}>👰</span>
          <span className="f3 white">💕</span>
          <span style={{ fontSize: '2rem' }}>🤵</span>
        </div>

        <p className="f6 white-80 mt5" style={{ fontFamily: 'Georgia, serif' }}>
          张先生 & 李小姐 敬邀
        </p>
      </div>

      <div
        className="absolute bottom-5 tc"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <span className="f6 white-70">🎉 婚礼邀请函 🎉</span>
      </div>
    </div>
  );
};

export default EndPage;
