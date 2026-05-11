import { deleteInterface } from '~/server/storage/apis';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  const success = deleteInterface(id);
  
  if (!success) {
    return {
      success: false,
      message: '接口不存在'
    };
  }
  
  return {
    success: true,
    message: '删除成功'
  };
});
