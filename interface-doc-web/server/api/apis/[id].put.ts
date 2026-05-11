import { updateInterface } from '~/server/storage/apis';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const updatedInterface = updateInterface(id, body);
  
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
