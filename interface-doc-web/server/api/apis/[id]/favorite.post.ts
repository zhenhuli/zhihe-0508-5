import { toggleFavorite } from '~/server/storage/apis';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  const updatedInterface = toggleFavorite(id);
  
  if (!updatedInterface) {
    return {
      success: false,
      message: '接口不存在'
    };
  }
  
  return {
    success: true,
    data: updatedInterface
  };
});
