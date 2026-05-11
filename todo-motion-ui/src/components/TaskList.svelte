<script>
  import { tasks } from '../stores/tasks'
  import { flip } from 'svelte/animate'
  import { fly, fade } from 'svelte/transition'

  export let filteredTasks = []

  const tagColors = {
    '工作': 'bg-blue-500',
    '学习': 'bg-green-500',
    '生活': 'bg-yellow-500',
    '健康': 'bg-red-500',
    '其他': 'bg-gray-500',
  }

  let draggedIndex = null
  let dragOverIndex = null

  function handleDragStart(e, index) {
    draggedIndex = index
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index)
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    dragOverIndex = index
  }

  function handleDragLeave() {
    dragOverIndex = null
  }

  function handleDrop(e, index) {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      tasks.reorder(draggedIndex, index)
    }
    draggedIndex = null
    dragOverIndex = null
  }

  function handleDragEnd() {
    draggedIndex = null
    dragOverIndex = null
  }

  function getTaskIndexInAllTasks(taskId) {
    const allTasks = $tasks
    return allTasks.findIndex((t) => t.id === taskId)
  }
</script>

<div class="space-y-3">
  {#if filteredTasks.length === 0}
    <div
      transition:fade
      class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      <div class="text-6xl mb-4">✨</div>
      <p class="text-lg">暂无任务</p>
      <p class="text-sm mt-2">添加一个新任务开始吧！</p>
    </div>
  {:else}
    {#each filteredTasks as task, index (task.id)}
      <div
        draggable="true"
        on:dragstart={(e) => handleDragStart(e, getTaskIndexInAllTasks(task.id))}
        on:dragover={(e) => handleDragOver(e, index)}
        on:dragleave={handleDragLeave}
        on:drop={(e) => handleDrop(e, getTaskIndexInAllTasks(task.id))}
        on:dragend={handleDragEnd}
        animate:flip={{ duration: 300 }}
        transition:fly={{ y: 20, duration: 300 }}
        class={`group p-4 rounded-xl border-2 transition-all duration-300 cursor-grab active:cursor-grabbing ${task.completed
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10'} ${draggedIndex === getTaskIndexInAllTasks(task.id) ? 'opacity-50 scale-95' : ''} ${dragOverIndex === index && draggedIndex !== getTaskIndexInAllTasks(task.id) ? 'border-purple-500 scale-102' : ''}`}
      >
        <div class="flex items-start gap-3">
          <button
            on:click={() => tasks.toggle(task.id)}
            class={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'}`}
          >
            {#if task.completed}
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            {/if}
          </button>

          <div class="flex-1 min-w-0">
            <p
              class={`text-base transition-all duration-300 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
            >
              {task.title}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span
                class={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${tagColors[task.tag] || 'bg-gray-500'}`}
              >
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                {task.tag}
              </span>
            </div>
          </div>

          <button
            on:click={() => tasks.remove(task.id)}
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>
