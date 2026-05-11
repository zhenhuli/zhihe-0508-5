<script>
  import { tasks, getToday } from '../stores/tasks'

  let title = ''
  let tag = '工作'
  let date = getToday()
  const tags = ['工作', '学习', '生活', '健康', '其他']

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    tasks.add({
      title: title.trim(),
      tag,
      date,
    })

    title = ''
    date = getToday()
  }
</script>

<form on:submit={handleSubmit} class="mb-6">
  <div class="flex flex-col gap-3">
    <input
      type="text"
      bind:value={title}
      placeholder="添加新任务..."
      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 focus:ring-4 focus:ring-purple-500/20"
    />
    <div class="flex flex-col gap-3 sm:flex-row">
      <select
        bind:value={tag}
        class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 cursor-pointer"
      >
        {#each tags as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      <input
        type="date"
        bind:value={date}
        class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 cursor-pointer"
      />
      <button
        type="submit"
        class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
      >
        添加
      </button>
    </div>
  </div>
</form>
