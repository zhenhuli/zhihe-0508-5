import { deleteCategory } from '~/server/storage/apis';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  const success = deleteCategory(id);
  
  if (!success) {
    return {
      success: false,
      message: '分类不存在'
    };
  }
  
  return {
    success: true,
    message: '删除成功'
  };
});
