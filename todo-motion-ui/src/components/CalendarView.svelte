<script>
  import { tasks, getToday } from '../stores/tasks'
  import { flip } from 'svelte/animate'
  import { fly, fade } from 'svelte/transition'

  let currentDate = new Date()
  let selectedDate = getToday()

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const tagColors = {
    '工作': 'bg-blue-500',
    '学习': 'bg-green-500',
    '生活': 'bg-yellow-500',
    '健康': 'bg-red-500',
    '其他': 'bg-gray-500',
  }

  $: currentMonth = currentDate.getMonth()
  $: currentYear = currentDate.getFullYear()
  $: today = getToday()

  $: calendarDays = getCalendarDays(currentYear, currentMonth)
  $: selectedTasks = $tasks.filter((t) => t.date === selectedDate)

  function getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    const startPadding = firstDay.getDay()
    for (let i = 0; i < startPadding; i++) {
      days.push({ day: null, date: null })
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = formatDateString(year, month, d)
      const tasksForDay = $tasks.filter((t) => t.date === date)
      days.push({
        day: d,
        date,
        tasks: tasksForDay,
        hasTasks: tasksForDay.length > 0,
        completedCount: tasksForDay.filter((t) => t.completed).length,
        totalCount: tasksForDay.length,
      })
    }

    return days
  }

  function formatDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function prevMonth() {
    currentDate = new Date(currentYear, currentMonth - 1, 1)
  }

  function nextMonth() {
    currentDate = new Date(currentYear, currentMonth + 1, 1)
  }

  function goToToday() {
    currentDate = new Date()
    selectedDate = today
  }

  function selectDate(date) {
    if (date) {
      selectedDate = date
    }
  }

  function toggleTask(id) {
    tasks.toggle(id)
  }

  function removeTask(id) {
    tasks.remove(id)
  }

  $: monthName = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][currentMonth]
  $: selectedDateDisplay = formatSelectedDate(selectedDate)

  function formatSelectedDate(dateStr) {
    const date = new Date(dateStr)
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    return date.toLocaleDateString('zh-CN', options)
  }
</script>

<div class="space-y-6">
  <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-purple-500/10 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {currentYear}年 {monthName}
      </h2>
      <div class="flex items-center gap-2">
        <button
          on:click={prevMonth}
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          on:click={goToToday}
          class="px-3 py-1.5 text-sm rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all"
        >
          今天
        </button>
        <button
          on:click={nextMonth}
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all hover:scale-110"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-2">
      {#each weekDays as day}
        <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
          {day}
        </div>
      {/each}
    </div>

    <div class="grid grid-cols-7 gap-1">
      {#each calendarDays as calDay}
        {#if calDay.day}
          <button
            on:click={() => selectDate(calDay.date)}
            class={`relative aspect-square rounded-xl p-1 transition-all duration-300 flex flex-col items-center justify-start {calDay.date === selectedDate
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
              : calDay.date === today
                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 ring-2 ring-purple-500/50'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white'}`}
          >
            <span class="text-sm font-medium">{calDay.day}</span>
            {#if calDay.hasTasks}
              <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                {#each calDay.tasks.slice(0, 3) as task}
                  <span
                    class={`w-1.5 h-1.5 rounded-full ${tagColors[task.tag] || 'bg-gray-500'} ${task.completed ? 'opacity-50' : ''}`}
                  ></span>
                {/each}
              </div>
              {#if calDay.totalCount > 0}
                <span class="absolute top-1 right-1 text-[10px] font-medium opacity-70">
                  {calDay.completedCount}/{calDay.totalCount}
                </span>
              {/if}
            {/if}
          </button>
        {:else}
          <div class="aspect-square"></div>
        {/if}
      {/each}
    </div>
  </div>

  <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-purple-500/10 p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {selectedDateDisplay}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {selectedTasks.length} 个任务
        </p>
      </div>
    </div>

    {#if selectedTasks.length === 0}
      <div
        transition:fade
        class="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <div class="text-4xl mb-3">🍃</div>
        <p>这一天没有任务</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each selectedTasks as task (task.id)}
          <div
            animate:flip={{ duration: 300 }}
            transition:fly={{ y: 20, duration: 300 }}
            class={`group p-4 rounded-xl border-2 transition-all duration-300 ${task.completed
              ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-70'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400'}`}
          >
            <div class="flex items-start gap-3">
              <button
                on:click={() => toggleTask(task.id)}
                class={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'}`}
              >
                {#if task.completed}
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                {/if}
              </button>

              <div class="flex-1 min-w-0">
                <p
                  class={`text-sm transition-all duration-300 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
                >
                  {task.title}
                </p>
                <span
                  class={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white mt-2 ${tagColors[task.tag] || 'bg-gray-500'}`}
                >
                  {task.tag}
                </span>
              </div>

              <button
                on:click={() => removeTask(task.id)}
                class="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
