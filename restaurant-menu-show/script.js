const menuData = [
    { 
        id: 1, 
        name: '凯撒沙拉', 
        category: 'appetizer', 
        price: 38, 
        description: '新鲜罗马生菜配帕玛森芝士和凯撒酱', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop',
        specs: [
            { name: '小份', price: 38 },
            { name: '大份', price: 58 }
        ],
        details: '精选新鲜罗马生菜，搭配酥脆面包丁，帕玛森芝士和秘制凯撒酱，清爽开胃。'
    },
    { 
        id: 2, 
        name: '蒜香面包', 
        category: 'appetizer', 
        price: 22, 
        description: '法式面包配蒜蓉和香草黄油', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
        specs: [
            { name: '2片装', price: 22 },
            { name: '4片装', price: 38 }
        ],
        details: '外酥里嫩的法式面包，涂抹蒜蓉和香草黄油后烘烤，香气四溢。'
    },
    { 
        id: 3, 
        name: '奶油蘑菇汤', 
        category: 'appetizer', 
        price: 32, 
        description: '浓郁奶油汤底配新鲜蘑菇', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop',
        specs: [
            { name: '标准份', price: 32 },
            { name: '大份', price: 45 }
        ],
        details: '精选多种新鲜蘑菇慢炖而成，奶油汤底浓郁醇厚，口感丝滑。'
    },
    { 
        id: 4, 
        name: '菲力牛排', 
        category: 'main', 
        price: 168, 
        description: '澳洲和牛菲力，配黑胡椒酱和时蔬', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1485988412941-77a35537dae4?w=400&h=400&fit=crop',
        specs: [
            { name: '150g', price: 168 },
            { name: '200g', price: 218 }
        ],
        details: '澳洲进口和牛菲力，肉质鲜嫩多汁，可选择熟度，搭配自制黑胡椒酱和时令蔬菜。'
    },
    { 
        id: 5, 
        name: '三文鱼排', 
        category: 'main', 
        price: 128, 
        description: '挪威三文鱼，配柠檬黄油汁', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
        specs: [
            { name: '180g', price: 128 },
            { name: '250g', price: 168 }
        ],
        details: '挪威进口新鲜三文鱼，低温慢煎至表皮金黄，肉质鲜嫩，搭配柠檬黄油汁。'
    },
    { 
        id: 6, 
        name: '意式肉酱面', 
        category: 'main', 
        price: 58, 
        description: '经典博洛尼亚肉酱配意大利面', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
        specs: [
            { name: '标准份', price: 58 },
            { name: '加蛋', price: 68 }
        ],
        details: '传统意式博洛尼亚肉酱，慢炖3小时，搭配手工意大利面，经典美味。'
    },
    { 
        id: 7, 
        name: '烤鸡套餐', 
        category: 'main', 
        price: 88, 
        description: '香草烤鸡配薯条和沙拉', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop',
        specs: [
            { name: '半只鸡', price: 88 },
            { name: '整只鸡', price: 158 }
        ],
        details: '香草腌制整鸡，慢火烤制，皮脆肉嫩，配香脆薯条和新鲜沙拉。'
    },
    { 
        id: 8, 
        name: '提拉米苏', 
        category: 'dessert', 
        price: 42, 
        description: '经典意式甜点，马斯卡彭芝士', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
        specs: [
            { name: '单人份', price: 42 },
            { name: '双人份', price: 78 }
        ],
        details: '经典意式甜点，马斯卡彭芝士搭配咖啡手指饼干，层次丰富，入口即化。'
    },
    { 
        id: 9, 
        name: '巧克力熔岩蛋糕', 
        category: 'dessert', 
        price: 48, 
        description: '温热巧克力蛋糕配香草冰淇淋', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop',
        specs: [
            { name: '单球', price: 48 },
            { name: '双球', price: 58 }
        ],
        details: '切开即流出香浓巧克力酱，搭配香草冰淇淋球，温热与冰爽的完美结合。'
    },
    { 
        id: 10, 
        name: '芝士蛋糕', 
        category: 'dessert', 
        price: 38, 
        description: '纽约风格芝士蛋糕配莓果', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd29a8ce0b?w=400&h=400&fit=crop',
        specs: [
            { name: '原味', price: 38 },
            { name: '草莓', price: 45 }
        ],
        details: '纽约风格重芝士蛋糕，口感绵密浓郁，搭配新鲜莓果，酸甜可口。'
    },
    { 
        id: 11, 
        name: '现磨咖啡', 
        category: 'drink', 
        price: 28, 
        description: '精选阿拉比卡咖啡豆现磨', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
        specs: [
            { name: '美式', price: 28 },
            { name: '拿铁', price: 35 }
        ],
        details: '精选阿拉比卡咖啡豆，现点现磨，香气浓郁，可选择热饮或冰饮。'
    },
    { 
        id: 12, 
        name: '鲜榨橙汁', 
        category: 'drink', 
        price: 25, 
        description: '新鲜橙子现榨，富含维C', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240a05?w=400&h=400&fit=crop',
        specs: [
            { name: '300ml', price: 25 },
            { name: '500ml', price: 38 }
        ],
        details: '精选新鲜橙子，现点现榨，100%纯果汁，富含维生素C，健康美味。'
    },
    { 
        id: 13, 
        name: '红酒', 
        category: 'drink', 
        price: 88, 
        description: '法国波尔多产区干红', 
        hot: true, 
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop',
        specs: [
            { name: '单杯', price: 88 },
            { name: '整瓶', price: 388 }
        ],
        details: '法国波尔多产区进口干红，单宁柔顺，果香浓郁，适合搭配红肉。'
    },
    { 
        id: 14, 
        name: '莫吉托', 
        category: 'drink', 
        price: 45, 
        description: '经典朗姆鸡尾酒配薄荷和青柠', 
        hot: false, 
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32f?w=400&h=400&fit=crop',
        specs: [
            { name: '含酒精', price: 45 },
            { name: '无酒精', price: 38 }
        ],
        details: '经典古巴鸡尾酒，白朗姆酒搭配新鲜薄荷、青柠和苏打水，清爽解暑。'
    }
];

const categories = [
    { key: 'hot', name: '🔥 热销' },
    { key: 'appetizer', name: '开胃菜' },
    { key: 'main', name: '主菜' },
    { key: 'dessert', name: '甜点' },
    { key: 'drink', name: '饮品' }
];

let currentCategory = 'hot';
let selectedSpec = 0;

function renderCategories() {
    const sidebar = document.getElementById('categorySidebar');
    sidebar.innerHTML = categories.map(cat => `
        <div class="category-item ${currentCategory === cat.key ? 'active' : ''}" data-category="${cat.key}">
            ${cat.name}
        </div>
    `).join('');
}

function renderMenu() {
    const content = document.getElementById('menuContent');
    let html = '';

    categories.forEach(cat => {
        let items;
        if (cat.key === 'hot') {
            items = menuData.filter(item => item.hot);
        } else {
            items = menuData.filter(item => item.category === cat.key);
        }

        if (items.length > 0) {
            html += `
                <section class="category-section" id="section-${cat.key}">
                    <div class="category-title">${cat.name}</div>
                    ${items.map(item => `
                        <div class="menu-item" data-id="${item.id}">
                            <img class="item-image" src="${item.image}" alt="${item.name}" loading="lazy">
                            <div class="item-info">
                                <div>
                                    <div class="item-header">
                                        <span class="item-name">${item.name}</span>
                                        ${item.hot ? '<span class="hot-tag">热销</span>' : ''}
                                    </div>
                                    <div class="item-description">${item.description}</div>
                                </div>
                                <div class="item-bottom">
                                    <span class="item-price">${item.price}</span>
                                    <button class="add-btn">+</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </section>
            `;
        }
    });

    content.innerHTML = html;
}

function showDetail(id) {
    const item = menuData.find(i => i.id === parseInt(id));
    if (!item) return;

    selectedSpec = 0;
    const detailPage = document.getElementById('detailPage');
    const detailContent = document.getElementById('detailContent');

    detailContent.innerHTML = `
        <img class="detail-image" src="${item.image}" alt="${item.name}">
        <div class="detail-info">
            <div class="detail-name">${item.name}</div>
            <div class="detail-tags">
                ${item.hot ? '<span class="detail-tag">热销</span>' : ''}
                <span class="detail-tag">${categories.find(c => c.key === item.category)?.name || item.category}</span>
            </div>
            <div class="detail-description">${item.details}</div>
            
            <div class="detail-section">
                <div class="detail-section-title">规格选择</div>
                <div class="spec-grid">
                    ${item.specs.map((spec, index) => `
                        <div class="spec-item ${index === selectedSpec ? 'active' : ''}" data-spec="${index}">
                            <div class="spec-name">${spec.name}</div>
                            <div class="spec-price">¥${spec.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="detail-bottom">
            <span class="detail-price">${item.specs[selectedSpec].price}</span>
            <button class="add-cart-btn">加入购物车</button>
        </div>
    `;

    detailContent.querySelectorAll('.spec-item').forEach(el => {
        el.addEventListener('click', () => {
            selectedSpec = parseInt(el.getAttribute('data-spec'));
            detailContent.querySelectorAll('.spec-item').forEach(s => s.classList.remove('active'));
            el.classList.add('active');
            detailContent.querySelector('.detail-price').textContent = item.specs[selectedSpec].price;
        });
    });

    detailPage.classList.add('active');
}

function hideDetail() {
    const detailPage = document.getElementById('detailPage');
    detailPage.classList.remove('active');
}

function initCategoryClick() {
    const sidebar = document.getElementById('categorySidebar');
    const content = document.getElementById('menuContent');

    sidebar.addEventListener('click', (e) => {
        const item = e.target.closest('.category-item');
        if (!item) return;

        const category = item.getAttribute('data-category');
        currentCategory = category;

        document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        const section = document.getElementById(`section-${category}`);
        if (section) {
            content.scrollTo({
                top: section.offsetTop - 8,
                behavior: 'smooth'
            });
        }
    });
}

function initMenuClick() {
    const content = document.getElementById('menuContent');
    content.addEventListener('click', (e) => {
        const item = e.target.closest('.menu-item');
        if (!item) return;
        if (e.target.closest('.add-btn')) return;

        const id = item.getAttribute('data-id');
        showDetail(id);
    });
}

function initBackBtn() {
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', hideDetail);
}

function initScrollSync() {
    const content = document.getElementById('menuContent');
    
    content.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.category-section');
        let activeKey = categories[0].key;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100) {
                activeKey = section.id.replace('section-', '');
            }
        });

        if (activeKey !== currentCategory) {
            currentCategory = activeKey;
            document.querySelectorAll('.category-item').forEach(el => {
                el.classList.toggle('active', el.getAttribute('data-category') === activeKey);
            });

            const activeItem = document.querySelector(`.category-item[data-category="${activeKey}"]`);
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderMenu();
    initCategoryClick();
    initMenuClick();
    initBackBtn();
    initScrollSync();
    initThemeToggle();
});