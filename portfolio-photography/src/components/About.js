import React from 'react';
import LazyImage from './LazyImage';

const About = () => {
  return (
    <section id="about" className="pv5 pv6-l ph3 ph4-l bg-near-black">
      <div className="mw9 center">
        <div className="tc mb5 mb6-l">
          <h2 className="section-title f2 f1-l fw1 mv4 white">关于我</h2>
          <p className="light-silver f5 f4-l lh-copy mw7 center">
            用镜头讲述故事，用光影记录人生
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center">
          <div className="w-100 w-50-m w-40-l pa3">
            <div className="br3 overflow-hidden">
              <LazyImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop"
                alt="摄影师头像"
                className="w-100 h-auto"
              />
            </div>
          </div>

          <div className="w-100 w-50-m w-60-l pa3">
            <h3 className="f3 f2-l fw6 white mb3 mb4-l">陈明远</h3>
            <p className="light-silver f5 f4-l lh-copy mb3 mb4-l">
              我是一名专业摄影师，拥有超过10年的摄影经验。从小就对光影艺术充满热情，
              从最初的胶片机到现在的数码设备，摄影一直是我生命中不可或缺的一部分。
            </p>
            <p className="light-silver f5 f4-l lh-copy mb4 mb5-l">
              我专注于人像、风景和街拍摄影，相信每一张照片都应该讲述一个故事。
              无论是人物的情感流露，还是大自然的壮丽景色，我都致力于捕捉最真实、
              最动人的瞬间。
            </p>

            <div className="flex flex-wrap gap-3 gap4-l">
              {[
                { value: '500+', label: '完成项目' },
                { value: '10+', label: '年经验' },
                { value: '50+', label: '获奖作品' },
                { value: '100%', label: '客户满意' },
              ].map((stat, index) => (
                <div key={index} className="tc">
                  <div className="f1 f-headline-l fw7 white">{stat.value}</div>
                  <div className="f6 light-silver mt1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
