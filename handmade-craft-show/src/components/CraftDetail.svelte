<script>
  import { CATEGORIES } from '../types/craft.js';
  import { crafts } from '../stores/crafts.js';
  
  export let craft;
  export let onClose;

  const category = CATEGORIES.find(c => c.id === craft.category) || { name: '其他', icon: '✨' };

  function handleDelete() {
    if (confirm('确定要删除这个作品吗？')) {
      crafts.deleteCraft(craft.id);
      onClose();
    }
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="text-3xl">{category.icon}</span>
        <h2 class="text-2xl font-bold text-gray-800">{craft.title}</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          on:click={handleDelete}
          class="px-3 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
        >
          删除
        </button>
        <button on:click={onClose} class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
    </div>
    
    <div class="p-6 space-y-6">
      {#if craft.images && craft.images.length > 0}
        <div class="grid grid-cols-4 gap-4">
          {#each craft.images as img, index}
            <img src={img} alt="作品图片" class="w-full h-24 object-cover rounded-lg" />
          {/each}
        </div>
      {/if}

      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">📝 作品描述</h3>
        <p class="text-gray-600">{craft.description || '暂无描述'}</p>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-3">📦 材料清单</h3>
        <div class="flex flex-wrap gap-2">
          {#each craft.materials || [] as material}
            <span class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
              {material}
            </span>
          {:else}
            <p class="text-gray-400">暂无材料信息</p>
          {/each}
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-3">👩‍🎨 制作步骤</h3>
        <div class="space-y-4">
          {#each craft.steps || [] as step, index}
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="flex gap-4 mb-3">
                <span class="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p class="text-gray-700 pt-1">{typeof step === 'string' ? step : step.text}</p>
              </div>
              {#if typeof step !== 'string' && step.images && step.images.length > 0}
                <div class="ml-12 grid grid-cols-4 gap-2">
                  {#each step.images as img}
                    <img src={img} alt="步骤图片" class="w-full h-20 object-cover rounded-lg" />
                  {/each}
                </div>
              {/if}
            </div>
          {:else}
            <p class="text-gray-400">暂无制作步骤</p>
          {/each}
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <p class="text-sm text-gray-400">
          创建于：{new Date(craft.createdAt).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </div>
  </div>
</div>
