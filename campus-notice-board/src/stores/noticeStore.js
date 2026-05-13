import { reactive } from 'vue'
import { notices as initialNotices } from '../data/notices'

const state = reactive({
  notices: [...initialNotices]
})

export function useNoticeStore() {
  const addNotice = (notice) => {
    const maxId = Math.max(...state.notices.map(n => n.id), 0)
    state.notices.unshift({
      ...notice,
      id: maxId + 1,
      date: new Date().toISOString().split('T')[0]
    })
  }

  const getAllNotices = () => {
    return state.notices
  }

  const getNoticeById = (id) => {
    return state.notices.find(n => n.id === parseInt(id))
  }

  return {
    notices: state.notices,
    addNotice,
    getAllNotices,
    getNoticeById
  }
}
