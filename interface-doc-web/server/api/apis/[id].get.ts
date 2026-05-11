import { getInterfaceById } from '~/server/storage/apis';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  const apiInterface = getInterfaceById(id);
  
  if (!apiInterface) {
    return {
      success: false,
      message: '接口不存在'
    };
  }
  
  return {
    success: true,
    data: apiInterface
  };
});
