import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import TaskFilter from '../TaskFilter.svelte'

describe('TaskFilter Component', () => {
  it('should render all filter buttons', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'all' } })
    expect(getByText('全部')).toBeInTheDocument()
    expect(getByText('进行中')).toBeInTheDocument()
    expect(getByText('已完成')).toBeInTheDocument()
  })

  it('should apply active styles to "全部" button when filter is "all"', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'all' } })
    const allButton = getByText('全部')
    expect(allButton.className).toContain('bg-gradient-to-r')
    expect(allButton.className).toContain('text-white')
  })

  it('should apply active styles to "进行中" button when filter is "active"', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'active' } })
    const activeButton = getByText('进行中')
    expect(activeButton.className).toContain('bg-gradient-to-r')
    expect(activeButton.className).toContain('text-white')
  })

  it('should apply active styles to "已完成" button when filter is "completed"', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'completed' } })
    const completedButton = getByText('已完成')
    expect(completedButton.className).toContain('bg-gradient-to-r')
    expect(completedButton.className).toContain('text-white')
  })

  it('should apply correct non-active styles to unselected buttons', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'all' } })
    const activeButton = getByText('进行中')
    expect(activeButton.className).toContain('bg-gray-100')
    expect(activeButton.className).toContain('text-gray-700')
  })

  it('should have hover scale animation', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'all' } })
    const activeButton = getByText('进行中')
    expect(activeButton.className).toContain('hover:scale-105')
  })

  it('should have rounded pill shape', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'all' } })
    const allButton = getByText('全部')
    expect(allButton.className).toContain('rounded-full')
  })

  it('should have proper padding and font size', () => {
    const { getByText } = render(TaskFilter, { props: { filter: 'all' } })
    const allButton = getByText('全部')
    expect(allButton.className).toContain('px-4')
    expect(allButton.className).toContain('py-2')
    expect(allButton.className).toContain('text-sm')
  })
})
