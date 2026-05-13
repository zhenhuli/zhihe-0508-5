<script>
  import { CATEGORIES } from '../types/craft.js';
  import { crafts } from '../stores/crafts.js';

  export let onClose;
  
  let title = '';
  let description = '';
  let category = 'other';
  let materials = [''];
  let steps = [{ text: '', images: [] }];
  let images = [];
  let error = '';

  const categories = CATEGORIES.filter(c => c.id !== 'all');

  function addMaterial() {
    materials = [...materials, ''];
  }

  function removeMaterial(index) {
    materials = materials.filter((_, i) => i !== index);
  }

  function updateMaterial(index, value) {
    materials = materials.map((m, i) => i === index ? value : m);
  }

  function addStep() {
    steps = [...steps, { text: '', images: [] }];
  }

  function removeStep(index) {
    steps = steps.filter((_, i) => i !== index);
  }

  function updateStepText(index, value) {
    steps = steps.map((s, i) => i === index ? { ...s, text: value } : s);
  }

  function handleStepImageUpload(event, stepIndex) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        steps = steps.map((s, i) => {
          if (i === stepIndex) {
            return { ...s, images: [...s.images, e.target.result] };
          }
          return s;
        });
      };
      reader.readAsDataURL(file);
    });
  }

  function removeStepImage(stepIndex, imageIndex) {
    steps = steps.map((s, i) => {
      if (i === stepIndex) {
        return { ...s, images: s.images.filter((_, j) => j !== imageIndex) };
      }
      return s;
    });
  }

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        images = [...images, e.target.result];
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    images = images.filter((_, i) => i !== index);
  }

  function handleSubmit() {
    error = '';
    
    const validMaterials = materials.filter(m => m.trim());
    if (validMaterials.length === 0) {
      error = '请至少添加一种材料';
      return;
    }
    
    if (images.length === 0) {
      error = '请至少上传一张作品图片';
      return;
    }

    const craft = {
      title,
      description,
      category,
      materials: validMaterials,
      steps: steps.filter(s => s.text.trim()),
      images
    };
    crafts.addCraft(craft);
    onClose();
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">上传新作品</h2>
      <button on:click={onClose} class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-6">
      {#if error}
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      {/if}

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          作品名称 <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={title}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="请输入作品名称"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">作品描述</label>
        <textarea
          bind:value={description}
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="请输入作品描述"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          分类 <span class="text-red-500">*</span>
        </label>
        <select
          bind:value={category}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          {#each categories as cat}
            <option value={cat.id}>{cat.icon} {cat.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          材料清单 <span class="text-red-500">*</span>
        </label>
        <div class="space-y-2">
          {#each materials as material, index}
            <div class="flex gap-2">
              <input
                type="text"
                value={material}
                on:input={(e) => updateMaterial(index, e.target.value)}
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="材料名称"
              />
              {#if materials.length > 1}
                <button
                  type="button"
                  on:click={() => removeMaterial(index)}
                  class="px-3 py-2 text-red-500 hover:text-red-700"
                >
                  删除
                </button>
              {/if}
            </div>
          {/each}
        </div>
        <button
          type="button"
          on:click={addMaterial}
          class="mt-2 text-amber-600 hover:text-amber-800 text-sm"
        >
          + 添加材料
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">制作步骤</label>
        <div class="space-y-4">
          {#each steps as step, index}
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="flex gap-2 items-start mb-3">
                <span class="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={step.text}
                  on:input={(e) => updateStepText(index, e.target.value)}
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="步骤描述"
                />
                {#if steps.length > 1}
                  <button
                    type="button"
                    on:click={() => removeStep(index)}
                    class="px-3 py-2 text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                {/if}
              </div>
              
              <div class="ml-10">
                <label class="block text-sm text-gray-600 mb-2">步骤图片（可选）</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  on:change={(e) => handleStepImageUpload(e, index)}
                  class="hidden"
                  id="step-image-upload-{index}"
                />
                <label for="step-image-upload-{index}" class="cursor-pointer inline-block px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors">
                  + 上传步骤图片
                </label>
                
                {#if step.images.length > 0}
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    {#each step.images as img, imgIndex}
                      <div class="relative">
                        <img src={img} alt="步骤图片" class="w-full h-16 object-cover rounded-lg" />
                        <button
                          type="button"
                          on:click={() => removeStepImage(index, imgIndex)}
                          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <button
          type="button"
          on:click={addStep}
          class="mt-2 text-amber-600 hover:text-amber-800 text-sm"
        >
          + 添加步骤
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          作品图片 <span class="text-red-500">*</span>
        </label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            on:change={handleImageUpload}
            class="hidden"
            id="image-upload"
          />
          <label for="image-upload" class="cursor-pointer">
            <span class="text-amber-600 hover:text-amber-800">点击上传图片</span>
          </label>
        </div>
        {#if images.length > 0}
          <div class="mt-4 grid grid-cols-4 gap-2">
            {#each images as img, index}
              <div class="relative">
                <img src={img} alt="预览" class="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  on:click={() => removeImage(index)}
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm"
                >
                  &times;
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="button"
          on:click={onClose}
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          class="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          保存作品
        </button>
      </div>
    </form>
  </div>
</div>
