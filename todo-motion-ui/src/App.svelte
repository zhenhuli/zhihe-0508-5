<script>
  import { tasks, getToday } from './stores/tasks'
  import { derived } from 'svelte/store'
  import { fade, slide } from 'svelte/transition'

  import TaskForm from './components/TaskForm.svelte'
  import TaskFilter from './components/TaskFilter.svelte'
  import TagFilter from './components/TagFilter.svelte'
  import TaskList from './components/TaskList.svelte'
  import ThemeToggle from './components/ThemeToggle.svelte'
  import NavTabs from './components/NavTabs.svelte'
  import CalendarView from './components/CalendarView.svelte'

  let activeTab = 'today'
  let filter = 'all'
  let selectedTags = new Set()

  $: today = getToday()
  $: todayTasks = $tasks.filter((t) => t.date === today)

  $: filteredTodayTasks = todayTasks.filter((task) => {
    if (filter === 'active' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false
    if (selectedTags.size > 0 && !selectedTags.has(task.tag)) return false
    return true
  })

  const stats = derived(tasks, ($tasks) => {
    const total = $tasks.length
    const completed = $tasks.filter((t) => t.completed).length
    const active = total - completed
    const todayTotal = $tasks.filter((t) => t.date === today).length
    const todayCompleted = $tasks.filter((t) => t.date === today && t.completed).length
    const todayActive = todayTotal - todayCompleted
    return { total, completed, active, todayTotal, todayCompleted, todayActive }
  })

  function handleTabChange(e) {
    activeTab = e.detail
  }

  function handleFilterChange(e) {
    filter = e.detail
  }

  function handleTagChange(e) {
    selectedTags = new Set(e.detail)
  }

  $: todayDisplay = formatToday(today)

  function formatToday(dateStr) {
    const date = new Date(dateStr)
    const options = { month: 'long', day: 'numeric', weekday: 'long' }
    return date.toLocaleDateString('zh-CN', options)
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
  <div class="max-w-2xl mx-auto px-4 py-8">
    <header class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Todo Motion
        </h1>
        <ThemeToggle />
      </div>
      <p class="text-gray-600 dark:text-gray-400">
        高效管理你的日常任务，让生活更有条理 ✨
      </p>
    </header>

    <NavTabs {activeTab} on:tabChange={handleTabChange} />

    {#if activeTab === 'today'}
      <div transition:fade={{ duration: 300 }}>
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-purple-500/10 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                📅 {todayDisplay}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                今日任务
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {$stats.todayActive}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                待完成 / {$stats.todayTotal}
              </div>
            </div>
          </div>

          <TaskForm />
        </div>

        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-purple-500/10 p-6">
          <div class="flex items-center gap-2 mb-4">
            <svg
              class="w-5 h-5 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <h2 class="font-semibold text-gray-900 dark:text-white">筛选</h2>
          </div>

          <div class="mb-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 block mb-2">状态</span>
            <TaskFilter
              {filter}
              on:filterChange={handleFilterChange}
            />
          </div>

          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400 block mb-2">标签</span>
            <TagFilter
              {selectedTags}
              on:tagChange={handleTagChange}
            />
          </div>
        </div>

        <div class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <svg
                class="w-5 h-5 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <h2 class="font-semibold text-gray-900 dark:text-white">今日任务</h2>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              拖拽排序 · 共 {filteredTodayTasks.length} 项
            </span>
          </div>

          <TaskList filteredTasks={filteredTodayTasks} />
        </div>
      </div>
    {:else}
      <div transition:fade={{ duration: 300 }}>
        <CalendarView />
      </div>
    {/if}

    <footer class="mt-12 text-center text-xs text-gray-400 dark:text-gray-500">
      <p>数据已自动保存到本地 · 刷新不丢失</p>
    </footer>
  </div>
</div>
