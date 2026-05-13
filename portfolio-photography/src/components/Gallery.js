import React, { useState } from 'react';
import { photos, categories } from '../data/photos';
import LazyImage from './LazyImage';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((photo) => photo.category === activeCategory);

  return (
    <section id="gallery" className="pv5 pv6-l ph3 ph4-l">
      <div className="mw9 center">
        <div className="tc mb5 mb6-l">
          <h2 className="section-title f2 f1-l fw1 mv4 white">作品展示</h2>
          <p className="light-silver f5 f4-l lh-copy mw7 center">
            用镜头记录生活中的每一个美好瞬间
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb5 mb6-l">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-btn pa2 ph4 ba b--white-30 bg-transparent white pointer f5 fw5 ${
                activeCategory === category.id ? 'bg-white black' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-start">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="gallery-item w-100 w-50-m w-third-l pa2"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div 
                className="relative overflow-hidden pointer"
                style={{ aspectRatio: '4/3' }}
              >
                <LazyImage
                  src={photo.url}
                  alt={photo.title}
                  className="w-100 h-100"
                />
                <div 
                  className="absolute top-0 left-0 w-100 h-100 flex flex-column items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  <h3 className="f3 fw6 white mb2">{photo.title}</h3>
                  <p className="f6 light-silver ph2 tc">{photo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed top-0 left-0 w-100 h-100 z-9999 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-2 right-3 f2 white bg-transparent bn pointer pa2"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
          <div className="w-90 w-80-m w-70-l tc">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-100 h-auto db"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
            <div className="mt4">
              <h3 className="f3 fw6 white">{selectedPhoto.title}</h3>
              <p className="f6 light-silver mt2">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
