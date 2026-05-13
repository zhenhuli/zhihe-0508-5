# 古诗词赏析

一个基于 Nuxt 3 的中国古诗词赏析网站，采用水墨古风设计。

## 功能特性

- 📚 **按朝代分类**：浏览唐、宋、汉、魏晋、明清等各朝代诗词
- 📖 **诗词正文**：优雅的排版展示诗词内容
- 🎵 **朗诵节奏**：可切换显示诗词朗诵节奏标记
- 📝 **词语注解**：重点词汇详细解释
- 🎭 **诗词赏析**：深度赏析诗词意境和艺术特色
- 📜 **创作背景**：了解诗词创作的历史背景

## 技术栈

- **框架**：Nuxt 3 (Vue 3)
- **样式**：Tailwind CSS + 自定义水墨古风主题
- **状态管理**：Pinia
- **语言**：TypeScript

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
poem-appreciate-page/
├── assets/
│   └── css/
│       └── main.css          # 全局样式和水墨主题
├── components/
│   ├── HeaderNav.vue         # 头部导航
│   ├── DynastyCard.vue       # 朝代卡片
│   └── PoemCard.vue          # 诗词卡片
├── data/
│   └── poems.ts              # 诗词数据
├── pages/
│   ├── index.vue             # 首页
│   ├── dynasty.vue           # 朝代列表页
│   ├── dynasty/[id].vue      # 朝代详情页
│   └── poem/[id].vue         # 诗词详情页
├── types/
│   └── poem.ts               # 类型定义
├── app.vue                   # 应用入口
├── nuxt.config.ts            # Nuxt 配置
└── tailwind.config.js        # Tailwind 配置
```

## 设计特色

### 水墨古风主题

- 淡雅的墨色渐变背景
- 竹绿色分割线
- 梅花点缀装饰
- 宣纸质感纹理

### 排版

- 楷体字体，还原古籍韵味
- 宽松的行间距，适合阅读
- 居中对齐，传统诗词排版方式

## 已收录诗词

- **唐代**：静夜思、春晓、登鹳雀楼、江雪
- **宋代**：水调歌头·明月几时有、声声慢·寻寻觅觅
- **汉代**：观沧海
- **魏晋**：饮酒·其五

## 开源协议

MIT
