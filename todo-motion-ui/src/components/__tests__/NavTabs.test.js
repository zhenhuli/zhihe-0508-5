import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import NavTabs from '../NavTabs.svelte'

describe('NavTabs Component', () => {
  it('should render both tab buttons', () => {
    const { getByText } = render(NavTabs, { props: { activeTab: 'today' } })
    expect(getByText('今日')).toBeInTheDocument()
    expect(getByText('日历')).toBeInTheDocument()
  })

  it('should show tab icons', () => {
    const { getByText } = render(NavTabs, { props: { activeTab: 'today' } })
    expect(getByText('📅')).toBeInTheDocument()
    expect(getByText('🗓️')).toBeInTheDocument()
  })

  it('should apply active styles to "今日" tab when activeTab is "today"', () => {
    const { getByText } = render(NavTabs, { props: { activeTab: 'today' } })
    const todayTab = getByText('今日').closest('button')
    expect(todayTab.className).toContain('bg-white')
    expect(todayTab.className).toContain('text-purple-600')
    expect(todayTab.className).toContain('shadow-md')
  })

  it('should apply active styles to "日历" tab when activeTab is "calendar"', () => {
    const { getByText } = render(NavTabs, { props: { activeTab: 'calendar' } })
    const calendarTab = getByText('日历').closest('button')
    expect(calendarTab.className).toContain('bg-white')
    expect(calendarTab.className).toContain('text-purple-600')
    expect(calendarTab.className).toContain('shadow-md')
  })

  it('should apply non-active styles to inactive tab', () => {
    const { getByText } = render(NavTabs, { props: { activeTab: 'today' } })
    const calendarTab = getByText('日历').closest('button')
    expect(calendarTab.className).toContain('text-gray-600')
  })

  it('should have flex container with gap', () => {
    const { container } = render(NavTabs, { props: { activeTab: 'today' } })
    const wrapper = container.querySelector('div')
    expect(wrapper.className).toContain('flex')
    expect(wrapper.className).toContain('gap-2')
  })

  it('should have background color', () => {
    const { container } = render(NavTabs, { props: { activeTab: 'today' } })
    const wrapper = container.querySelector('div')
    expect(wrapper.className).toContain('bg-gray-100')
  })

  it('should have rounded container', () => {
    const { container } = render(NavTabs, { props: { activeTab: 'today' } })
    const wrapper = container.querySelector('div')
    expect(wrapper.className).toContain('rounded-xl')
  })

  it('should have proper padding', () => {
    const { container } = render(NavTabs, { props: { activeTab: 'today' } })
    const wrapper = container.querySelector('div')
    expect(wrapper.className).toContain('p-1')
  })

  it('should have transition animations', () => {
    const { getByText } = render(NavTabs, { props: { activeTab: 'today' } })
    const todayTab = getByText('今日').closest('button')
    expect(todayTab.className).toContain('transition-all')
    expect(todayTab.className).toContain('duration-300')
  })
})
