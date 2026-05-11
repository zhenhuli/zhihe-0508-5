<script>
  export let activeTab = 'today'

  const tabs = [
    { id: 'today', label: '今日', icon: '📅' },
    { id: 'calendar', label: '日历', icon: '🗓️' },
  ]

  function dispatchTabChange(tabId) {
    activeTab = tabId
    dispatchEvent(new CustomEvent('tabChange', { detail: tabId }))
  }
</script>

<div class="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl mb-6">
  {#each tabs as tab}
    <button
      on:click={() => dispatchTabChange(tab.id)}
      class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 {activeTab === tab.id
        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md scale-105'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}"
    >
      <span>{tab.icon}</span>
      <span>{tab.label}</span>
    </button>
  {/each}
</div>
