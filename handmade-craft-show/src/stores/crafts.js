import { writable, derived } from 'svelte/store';
import { CATEGORIES } from '../types/craft.js';

const initialCrafts = [
  {
    id: 1,
    title: '温暖毛线围巾',
    description: '手工编织的温暖围巾，适合秋冬季节',
    category: 'knitting',
    materials: ['羊毛线', '棒针'],
    steps: [
      { text: '起针，根据所需宽度确定针数', images: [] },
      { text: '使用上下针编织主体部分', images: [] },
      { text: '编织至所需长度', images: [] },
      { text: '收针，整理两端流苏', images: [] }
    ],
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: '十字绣小挂件',
    description: '精致的十字绣作品，可作为钥匙扣或挂饰',
    category: 'embroidery',
    materials: ['绣布', '绣线', '绣针', '绣绷'],
    steps: [
      { text: '设计图案并转印到绣布上', images: [] },
      { text: '用十字绣针法刺绣图案', images: [] },
      { text: '完成刺绣后裁剪绣布', images: [] },
      { text: '制作挂件，添加挂绳', images: [] }
    ],
    images: [],
    createdAt: new Date().toISOString()
  }
];

function createCraftStore() {
  const { subscribe, update, set } = writable(initialCrafts);

  return {
    subscribe,
    addCraft: (craft) => update(crafts => [...crafts, { ...craft, id: Date.now(), createdAt: new Date().toISOString() }]),
    updateCraft: (id, updatedCraft) => update(crafts => crafts.map(c => c.id === id ? { ...c, ...updatedCraft } : c)),
    deleteCraft: (id) => update(crafts => crafts.filter(c => c.id !== id)),
    reset: () => set(initialCrafts)
  };
}

export const crafts = createCraftStore();
export const selectedCategory = writable('all');
export const filteredCrafts = derived([crafts, selectedCategory], ([$crafts, $selectedCategory]) => {
  if ($selectedCategory === 'all') return $crafts;
  return $crafts.filter(c => c.category === $selectedCategory);
});
