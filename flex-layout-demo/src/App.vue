<script setup>
import { ref, computed } from 'vue'

const justifyContent = ref('flex-start')
const alignItems = ref('stretch')
const flexWrap = ref('nowrap')
const flexDirection = ref('row')
const alignContent = ref('stretch')
const gap = ref(10)

const itemCount = ref(8)
const itemWidth = ref(120)
const itemHeight = ref(80)

const justifyContentOptions = [
  { value: 'flex-start', label: 'flex-start' },
  { value: 'flex-end', label: 'flex-end' },
  { value: 'center', label: 'center' },
  { value: 'space-between', label: 'space-between' },
  { value: 'space-around', label: 'space-around' },
  { value: 'space-evenly', label: 'space-evenly' }
]

const alignItemsOptions = [
  { value: 'stretch', label: 'stretch' },
  { value: 'flex-start', label: 'flex-start' },
  { value: 'flex-end', label: 'flex-end' },
  { value: 'center', label: 'center' },
  { value: 'baseline', label: 'baseline' }
]

const flexWrapOptions = [
  { value: 'nowrap', label: 'nowrap' },
  { value: 'wrap', label: 'wrap' },
  { value: 'wrap-reverse', label: 'wrap-reverse' }
]

const flexDirectionOptions = [
  { value: 'row', label: 'row' },
  { value: 'row-reverse', label: 'row-reverse' },
  { value: 'column', label: 'column' },
  { value: 'column-reverse', label: 'column-reverse' }
]

const alignContentOptions = [
  { value: 'stretch', label: 'stretch' },
  { value: 'flex-start', label: 'flex-start' },
  { value: 'flex-end', label: 'flex-end' },
  { value: 'center', label: 'center' },
  { value: 'space-between', label: 'space-between' },
  { value: 'space-around', label: 'space-around' }
]

const flexContainerStyle = computed(() => {
  const isRow = flexDirection.value === 'row' || flexDirection.value === 'row-reverse'
  const isNoWrap = flexWrap.value === 'nowrap'
  
  return {
    display: 'flex',
    justifyContent: justifyContent.value,
    alignItems: alignItems.value,
    flexWrap: flexWrap.value,
    flexDirection: flexDirection.value,
    alignContent: alignContent.value,
    gap: `${gap.value}px`,
    overflowX: isNoWrap && isRow ? 'auto' : 'visible',
    overflowY: isNoWrap && !isRow ? 'auto' : 'visible'
  }
})

const generatedCode = computed(() => {
  return `.flex-container {
  display: flex;
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};
  flex-wrap: ${flexWrap.value};
  flex-direction: ${flexDirection.value};
  align-content: ${alignContent.value};
  gap: ${gap.value}px;
}`
})

const items = computed(() => {
  return Array.from({ length: itemCount.value }, (_, i) => i + 1)
})

function addItem() {
  if (itemCount.value < 12) {
    itemCount.value++
  }
}

function removeItem() {
  if (itemCount.value > 1) {
    itemCount.value--
  }
}
</script>

<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Flex 布局可视化演示</h1>
        <p class="text-white/80 text-lg">实时调节 Flex 属性，直观学习前端布局</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <div class="control-panel">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              控制面板
            </h2>

            <div class="control-group">
              <label class="control-label">flex-direction (主轴方向)</label>
              <div class="radio-group">
                <label 
                  v-for="option in flexDirectionOptions" 
                  :key="option.value"
                  class="radio-label"
                  :class="{ active: flexDirection === option.value }"
                >
                  <input 
                    type="radio" 
                    :value="option.value" 
                    v-model="flexDirection"
                    class="hidden"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">justify-content (主轴对齐)</label>
              <div class="radio-group">
                <label 
                  v-for="option in justifyContentOptions" 
                  :key="option.value"
                  class="radio-label"
                  :class="{ active: justifyContent === option.value }"
                >
                  <input 
                    type="radio" 
                    :value="option.value" 
                    v-model="justifyContent"
                    class="hidden"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">align-items (侧轴对齐)</label>
              <div class="radio-group">
                <label 
                  v-for="option in alignItemsOptions" 
                  :key="option.value"
                  class="radio-label"
                  :class="{ active: alignItems === option.value }"
                >
                  <input 
                    type="radio" 
                    :value="option.value" 
                    v-model="alignItems"
                    class="hidden"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">flex-wrap (换行方式)</label>
              <div class="radio-group">
                <label 
                  v-for="option in flexWrapOptions" 
                  :key="option.value"
                  class="radio-label"
                  :class="{ active: flexWrap === option.value }"
                >
                  <input 
                    type="radio" 
                    :value="option.value" 
                    v-model="flexWrap"
                    class="hidden"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">align-content (多行对齐)</label>
              <div class="radio-group">
                <label 
                  v-for="option in alignContentOptions" 
                  :key="option.value"
                  class="radio-label"
                  :class="{ active: alignContent === option.value }"
                >
                  <input 
                    type="radio" 
                    :value="option.value" 
                    v-model="alignContent"
                    class="hidden"
                  >
                  {{ option.label }}
                </label>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">gap (间距: {{ gap }}px)</label>
              <input 
                type="range" 
                v-model.number="gap" 
                min="0" 
                max="50" 
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              >
            </div>

            <div class="control-group">
              <label class="control-label">盒子宽度: {{ itemWidth }}px</label>
              <input 
                type="range" 
                v-model.number="itemWidth" 
                min="60" 
                max="200" 
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              >
            </div>

            <div class="control-group">
              <label class="control-label">盒子高度: {{ itemHeight }}px</label>
              <input 
                type="range" 
                v-model.number="itemHeight" 
                min="40" 
                max="150" 
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              >
            </div>

            <div class="control-group">
              <label class="control-label">盒子数量: {{ itemCount }}</label>
              <div class="flex gap-2">
                <button 
                  @click="removeItem"
                  class="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  减少
                </button>
                <button 
                  @click="addItem"
                  class="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  增加
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="flex-container" :style="flexContainerStyle">
            <div 
              v-for="item in items" 
              :key="item"
              class="flex-item"
              :style="{ 
                height: (flexDirection === 'row' || flexDirection === 'row-reverse') && alignItems === 'stretch' ? 'auto' : `${itemHeight}px`,
                width: (flexDirection === 'column' || flexDirection === 'column-reverse') && alignItems === 'stretch' ? 'auto' : `${itemWidth}px`,
                minWidth: (flexDirection === 'column' || flexDirection === 'column-reverse') && alignItems === 'stretch' ? 'auto' : `${itemWidth}px`,
                minHeight: (flexDirection === 'row' || flexDirection === 'row-reverse') && alignItems === 'stretch' ? 'auto' : `${itemHeight}px`
              }"
            >
              {{ item }}
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              生成的 CSS 代码
            </h3>
            <div class="code-display">
              <pre><code><span class="code-bracket">.flex-container</span> {
  <span class="code-property">display</span>: <span class="code-value">flex</span>;
  <span class="code-property">justify-content</span>: <span class="code-value">{{ justifyContent }}</span>;
  <span class="code-property">align-items</span>: <span class="code-value">{{ alignItems }}</span>;
  <span class="code-property">flex-wrap</span>: <span class="code-value">{{ flexWrap }}</span>;
  <span class="code-property">flex-direction</span>: <span class="code-value">{{ flexDirection }}</span>;
  <span class="code-property">align-content</span>: <span class="code-value">{{ alignContent }}</span>;
  <span class="code-property">gap</span>: <span class="code-value">{{ gap }}px</span>;
}</code></pre>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Flex 属性说明
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-600 mb-2">flex-direction</h4>
                <p class="text-gray-600">决定主轴的方向，即项目排列的方向。</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-600 mb-2">justify-content</h4>
                <p class="text-gray-600">定义了项目在主轴上的对齐方式。</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-600 mb-2">align-items</h4>
                <p class="text-gray-600">定义项目在侧轴上如何对齐。</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-600 mb-2">flex-wrap</h4>
                <p class="text-gray-600">定义如果一条轴线排不下，如何换行。<br><span class="text-xs text-indigo-500">💡 提示：增加盒子数量或宽度可以更明显看到换行效果</span></p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-600 mb-2">align-content</h4>
                <p class="text-gray-600">定义了多根轴线的对齐方式（只有一行时无效）。</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-600 mb-2">gap</h4>
                <p class="text-gray-600">设置弹性项目之间的间距。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>