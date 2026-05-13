<script>
  import { CATEGORIES } from './types/craft.js';
  import { filteredCrafts, selectedCategory } from './stores/crafts.js';
  import CraftCard from './components/CraftCard.svelte';
  import CraftForm from './components/CraftForm.svelte';
  import CraftDetail from './components/CraftDetail.svelte';

  let showForm = false;
  let selectedCraft = null;

  function viewCraft(craft) {
    selectedCraft = craft;
  }

  function closeDetail() {
    selectedCraft = null;
  }

  function selectCategory(categoryId) {
    selectedCategory.set(categoryId);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
  <header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🎨</span>
          <h1 class="text-2xl font-bold text-gray-800">手工作品展示</h1>
        </div>
        <button
          on:click={() => showForm = true}
          class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>上传作品</span>
        </button>
      </div>
    </div>
  </header>

  <nav class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex gap-2 overflow-x-auto pb-2">
        {#each CATEGORIES as category}
          <button
            on:click={() => selectCategory(category.id)}
            class="px-4 py-2 rounded-full whitespace-nowrap transition-colors
              {$selectedCategory === category.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
          >
            <span class="mr-1">{category.icon}</span>
            {category.name}
          </button>
        {/each}
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-4 py-8">
    {#if $filteredCrafts.length === 0}
      <div class="text-center py-16">
        <span class="text-6xl">📭</span>
        <p class="mt-4 text-gray-500">暂无作品，快来上传你的第一个手工作品吧！</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each $filteredCrafts as craft}
          <CraftCard {craft} onView={viewCraft} />
        {/each}
      </div>
    {/if}
  </main>

  <footer class="bg-white border-t border-gray-100 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
      <p>🎨 用心制作，用爱分享</p>
    </div>
  </footer>
</div>

{#if showForm}
  <CraftForm onClose={() => showForm = false} />
{/if}

{#if selectedCraft}
  <CraftDetail craft={selectedCraft} onClose={closeDetail} />
{/if}
