import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import TagFilter from '../TagFilter.svelte'

describe('TagFilter Component', () => {
  it('should render all tag buttons', () => {
    const { getByText } = render(TagFilter, { props: { selectedTags: new Set() } })
    expect(getByText('工作')).toBeInTheDocument()
    expect(getByText('学习')).toBeInTheDocument()
    expect(getByText('生活')).toBeInTheDocument()
    expect(getByText('健康')).toBeInTheDocument()
    expect(getByText('其他')).toBeInTheDocument()
  })

  it('should show non-active style for unselected tags', () => {
    const { getByText } = render(TagFilter, { props: { selectedTags: new Set() } })
    const workTag = getByText('工作')
    expect(workTag.className).toContain('bg-gray-100')
  })

  it('should show active style with blue for "工作" tag when selected', () => {
    const selectedTags = new Set(['工作'])
    const { getByText } = render(TagFilter, { props: { selectedTags } })
    const workTag = getByText('工作')
    expect(workTag.className).toContain('bg-blue-500')
    expect(workTag.className).toContain('text-white')
  })

  it('should show active style with green for "学习" tag when selected', () => {
    const selectedTags = new Set(['学习'])
    const { getByText } = render(TagFilter, { props: { selectedTags } })
    const studyTag = getByText('学习')
    expect(studyTag.className).toContain('bg-green-500')
    expect(studyTag.className).toContain('text-white')
  })

  it('should show active style with yellow for "生活" tag when selected', () => {
    const selectedTags = new Set(['生活'])
    const { getByText } = render(TagFilter, { props: { selectedTags } })
    const lifeTag = getByText('生活')
    expect(lifeTag.className).toContain('bg-yellow-500')
    expect(lifeTag.className).toContain('text-white')
  })

  it('should show active style with red for "健康" tag when selected', () => {
    const selectedTags = new Set(['健康'])
    const { getByText } = render(TagFilter, { props: { selectedTags } })
    const healthTag = getByText('健康')
    expect(healthTag.className).toContain('bg-red-500')
    expect(healthTag.className).toContain('text-white')
  })

  it('should show active style with gray for "其他" tag when selected', () => {
    const selectedTags = new Set(['其他'])
    const { getByText } = render(TagFilter, { props: { selectedTags } })
    const otherTag = getByText('其他')
    expect(otherTag.className).toContain('bg-gray-500')
    expect(otherTag.className).toContain('text-white')
  })

  it('should have color dot indicators', () => {
    const selectedTags = new Set()
    const { getByText } = render(TagFilter, { props: { selectedTags } })
    const workTag = getByText('工作')
    const icon = workTag.querySelector('span')
    expect(icon).toBeInTheDocument()
    expect(icon.className).toContain('rounded-full')
  })

  it('should have hover scale animation', () => {
    const { getByText } = render(TagFilter, { props: { selectedTags: new Set() } })
    const workTag = getByText('工作')
    expect(workTag.className).toContain('hover:scale-105')
  })

  it('should have rounded pill shape', () => {
    const { getByText } = render(TagFilter, { props: { selectedTags: new Set() } })
    const workTag = getByText('工作')
    expect(workTag.className).toContain('rounded-full')
  })
})
