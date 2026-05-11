export const presetImages = [
  {
    id: 'landscape-1',
    name: '风景山水',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    category: '风景'
  },
  {
    id: 'city-1',
    name: '城市夜景',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=800&fit=crop',
    category: '城市'
  },
  {
    id: 'nature-1',
    name: '花海',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
    category: '自然'
  },
  {
    id: 'architecture-1',
    name: '几何建筑',
    url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=800&fit=crop',
    category: '建筑'
  },
  {
    id: 'animal-1',
    name: '可爱猫咪',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop',
    category: '动物'
  },
  {
    id: 'food-1',
    name: '美食拼盘',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop',
    category: '美食'
  },
  {
    id: 'art-1',
    name: '抽象艺术',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=800&fit=crop',
    category: '艺术'
  },
  {
    id: 'ocean-1',
    name: '海洋世界',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop',
    category: '风景'
  }
]

export class PresetImageLoader {
  async loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        resolve(img)
      }
      
      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
      
      img.src = url
    })
  }
}
