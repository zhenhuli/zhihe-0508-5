<script>
  export let filter = 'all'

  const filters = [
    { value: 'all', label: '全部' },
    { value: 'active', label: '进行中' },
    { value: 'completed', label: '已完成' },
  ]

  function dispatchFilterChange(value) {
    filter = value
    dispatchEvent(new CustomEvent('filterChange', { detail: value }))
  }
</script>

<div class="flex flex-wrap gap-2 mb-6">
  {#each filters as f}
    <button
      on:click={() => dispatchFilterChange(f.value)}
      class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 {filter === f.value
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30 scale-105'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'}"
    >
      {f.label}
    </button>
  {/each}
</div>
