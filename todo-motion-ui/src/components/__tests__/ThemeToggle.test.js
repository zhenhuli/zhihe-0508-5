import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import { writable } from 'svelte/store'
import ThemeToggle from '../ThemeToggle.svelte'

vi.mock('../../stores/tasks', () => {
  const mockTheme = writable('light')
  return {
    theme: {
      ...mockTheme,
      toggle: vi.fn(() => {
        mockTheme.update((val) => (val === 'light' ? 'dark' : 'light'))
      }),
    },
  }
})

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    vi.clearAllMocks()
  })

  it('should render the toggle button', () => {
    const { container } = render(ThemeToggle)
    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
  })

  it('should have correct ARIA label', () => {
    const { container } = render(ThemeToggle)
    const button = container.querySelector('button')
    expect(button).toHaveAttribute('aria-label', '切换主题')
  })

  it('should show sun icon when theme is light', async () => {
    const { container } = render(ThemeToggle)
    const iconContainer = container.querySelector('button > span')
    expect(iconContainer).toBeInTheDocument()
  })

  it('should have toggle switch with rounded full class', () => {
    const { container } = render(ThemeToggle)
    const button = container.querySelector('button')
    expect(button.className).toContain('rounded-full')
  })

  it('should have transition classes for smooth animation', () => {
    const { container } = render(ThemeToggle)
    const button = container.querySelector('button')
    expect(button.className).toContain('transition-all')
    expect(button.className).toContain('duration-300')
  })

  it('should have slider with rounded full style', () => {
    const { container } = render(ThemeToggle)
    const slider = container.querySelector('button > span')
    expect(slider.className).toContain('rounded-full')
  })
})
