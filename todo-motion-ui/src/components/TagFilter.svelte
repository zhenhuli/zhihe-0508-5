<script>
  export let selectedTags = new Set()

  const availableTags = ['工作', '学习', '生活', '健康', '其他']

  const tagColors = {
    '工作': 'bg-blue-500',
    '学习': 'bg-green-500',
    '生活': 'bg-yellow-500',
    '健康': 'bg-red-500',
    '其他': 'bg-gray-500',
  }

  function toggleTag(tag) {
    const newSet = new Set(selectedTags)
    if (newSet.has(tag)) {
      newSet.delete(tag)
    } else {
      newSet.add(tag)
    }
    selectedTags = newSet
    dispatchEvent(new CustomEvent('tagChange', { detail: Array.from(newSet) }))
  }
</script>

<div class="flex flex-wrap gap-2 mb-6">
  {#each availableTags as tag}
    <button
      on:click={() => toggleTag(tag)}
      class="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 {selectedTags.has(tag)
        ? `${tagColors[tag]} text-white shadow-md scale-105`
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105'}"
    >
      <span
        class="w-2 h-2 rounded-full {tagColors[tag]}"
        class:bg-white={selectedTags.has(tag)}
      ></span>
      {tag}
    </button>
  {/each}
</div>
