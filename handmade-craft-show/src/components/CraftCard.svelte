<script>
  import { CATEGORIES } from '../types/craft.js';
  export let craft;
  export let onView;

  const category = CATEGORIES.find(c => c.id === craft.category) || { name: '其他', icon: '✨' };
</script>

<div
  class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
  on:click={() => onView(craft)}
>
  <div class="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
    {#if craft.images && craft.images.length > 0}
      <img src={craft.images[0]} alt={craft.title} class="w-full h-full object-cover" />
    {:else}
      <span class="text-6xl">{category.icon}</span>
    {/if}
  </div>
  <div class="p-4">
    <div class="flex items-center gap-2 mb-2">
      <span class="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
        {category.icon} {category.name}
      </span>
    </div>
    <h3 class="text-lg font-semibold text-gray-800 mb-1">{craft.title}</h3>
    <p class="text-gray-500 text-sm line-clamp-2">{craft.description}</p>
    <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
      <span>📦 {craft.materials?.length || 0} 种材料</span>
      <span>📝 {craft.steps?.length || 0} 个步骤</span>
    </div>
  </div>
</div>
