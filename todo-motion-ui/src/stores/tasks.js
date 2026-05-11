import { writable, get } from 'svelte/store'

const STORAGE_KEY = 'todo-motion-ui-tasks'
const THEME_KEY = 'todo-motion-ui-theme'

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (e) {
    console.error('Failed to save tasks:', e)
  }
}

function loadTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    console.error('Failed to save theme:', e)
  }
}

function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getToday() {
  return formatDate(new Date())
}

function createTasksStore() {
  const { subscribe, set, update } = writable(loadFromStorage())

  subscribe((tasks) => {
    saveToStorage(tasks)
  })

  return {
    subscribe,
    add: (task) =>
      update((tasks) => [
        {
          id: Date.now().toString(),
          ...task,
          date: task.date || getToday(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...tasks,
      ]),
    toggle: (id) =>
      update((tasks) =>
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      ),
    update: (id, updatedTask) =>
      update((tasks) =>
        tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
      ),
    remove: (id) =>
      update((tasks) => tasks.filter((task) => task.id !== id)),
    reorder: (fromIndex, toIndex) =>
      update((tasks) => {
        const result = [...tasks]
        const [removed] = result.splice(fromIndex, 1)
        result.splice(toIndex, 0, removed)
        return result
      }),
    setFiltered: (tasks) => set(tasks),
  }
}

function createThemeStore() {
  const initialTheme = loadTheme()
  const { subscribe, set, update } = writable(initialTheme)

  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  subscribe((theme) => {
    saveTheme(theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return {
    subscribe,
    toggle: () =>
      update((current) => (current === 'light' ? 'dark' : 'light')),
    set,
  }
}

export const tasks = createTasksStore()
export const theme = createThemeStore()
export { formatDate, getToday }
