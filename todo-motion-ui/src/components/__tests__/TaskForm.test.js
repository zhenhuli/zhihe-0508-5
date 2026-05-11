import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import TaskForm from '../TaskForm.svelte'

vi.mock('../../stores/tasks', () => {
  const mockAdd = vi.fn()
  return {
    tasks: {
      add: mockAdd,
    },
    getToday: vi.fn(() => '2026-05-11'),
  }
})

describe('TaskForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render input, select, date picker and submit button', () => {
    const { getByPlaceholderText, getByRole } = render(TaskForm)
    expect(getByPlaceholderText('添加新任务...')).toBeInTheDocument()
    expect(getByRole('combobox')).toBeInTheDocument()
    expect(getByRole('button', { name: '添加' })).toBeInTheDocument()
  })

  it('should have "工作" as default tag', () => {
    const { getByDisplayValue } = render(TaskForm)
    expect(getByDisplayValue('工作')).toBeInTheDocument()
  })

  it('should have all tag options available', () => {
    const { getByRole } = render(TaskForm)
    const select = getByRole('combobox')
    expect(select.options).toHaveLength(5)
    expect(select.options[0].text).toBe('工作')
    expect(select.options[1].text).toBe('学习')
    expect(select.options[2].text).toBe('生活')
    expect(select.options[3].text).toBe('健康')
    expect(select.options[4].text).toBe('其他')
  })

  it('should apply gradient button styles', () => {
    const { getByRole } = render(TaskForm)
    const submitButton = getByRole('button', { name: '添加' })
    expect(submitButton.className).toContain('bg-gradient-to-r')
    expect(submitButton.className).toContain('from-purple-500')
    expect(submitButton.className).toContain('to-pink-500')
  })

  it('should input have proper focus styles', () => {
    const { getByPlaceholderText } = render(TaskForm)
    const input = getByPlaceholderText('添加新任务...')
    expect(input.className).toContain('focus:border-purple-500')
  })
})
