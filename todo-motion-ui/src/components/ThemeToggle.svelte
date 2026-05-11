<script>
  import { theme } from '../stores/tasks'
</script>

<button
  on:click={() => theme.toggle()}
  class="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/30"
  aria-label="切换主题"
>
  <span
    class="absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex items-center justify-center"
    class:left-7={$theme === 'dark'}
  >
    {#if $theme === 'dark'}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 text-yellow-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 text-yellow-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
        />
      </svg>
    {/if}
  </span>
</button>
