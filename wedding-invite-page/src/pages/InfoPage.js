import React, { useState, useEffect } from 'react';

const InfoPage = () => {
  const weddingDate = new Date('2026-10-01T12:00:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-column items-center">
      <div className="bg-washed-pink ba b--hot-pink br3 pa2 pa3-m ma1 shadow-1" style={{ minWidth: '50px' }}>
        <span className="f3 f2-m b hot-pink" style={{ fontFamily: 'Georgia, serif' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="f6 f5-m light-pink mt1">{label}</span>
    </div>
  );

  return (
    <div className="w-100 h-100 relative overflow-hidden bg-washed-pink">
      <div className="absolute top-0 left-0 w-100 h-100" style={{
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E9 50%, #FFC0CB 100%)'
      }} />

      <div className="relative z-1 w-100 h-100 flex flex-column">
        <div className="tc pt4 pt5-m pb3">
          <h2 className="f3 f2-m dark-pink ma0" style={{ fontFamily: 'Georgia, serif' }}>
            💒 婚礼倒计时
          </h2>
        </div>

        <div className="flex justify-center flex-wrap px2">
          <TimeBox value={timeLeft.days} label="天" />
          <TimeBox value={timeLeft.hours} label="时" />
          <TimeBox value={timeLeft.minutes} label="分" />
          <TimeBox value={timeLeft.seconds} label="秒" />
        </div>

        <div className="flex-1 flex items-center justify-center px3">
          <div className="w-100 max-w-sm bg-white-90 ba b--light-pink br4 pa4 shadow-3">
            <h3 className="f4 f3-m tc dark-pink mb4" style={{ fontFamily: 'Georgia, serif' }}>
              📍 婚宴详情
            </h3>

            <div className="flex flex-column gap-3">
              <div className="flex items-start gap-2">
                <span className="f2 f1-m">📅</span>
                <div>
                  <h4 className="f5 b dark-pink mb1">时间</h4>
                  <p className="f6 f5-m mid-gray lh-copy ma0">
                    2026年10月1日（星期四）<br />
                    中午 12:00 准时开席
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="f2 f1-m">🏨</span>
                <div>
                  <h4 className="f5 b dark-pink mb1">地点</h4>
                  <p className="f6 f5-m mid-gray lh-copy ma0">
                    喜来登大酒店 · 宴会厅<br />
                    上海市浦东新区世纪大道1号
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="f2 f1-m">👔</span>
                <div>
                  <h4 className="f5 b dark-pink mb1">着装建议</h4>
                  <p className="f6 f5-m mid-gray lh-copy ma0">
                    正装或礼服<br />
                    欢迎穿着喜庆色彩的服装
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb4 tc px3">
          <div className="dib ba b--hot-pink br-pill ph3 ph4-m pv2 bg-white-70">
            <span className="f6 f5-m hot-pink b">
              💕 期待您的到来，与我们共同见证这美好时刻 💕
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
