import { updateCategory } from '~/server/storage/apis';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const updatedCategory = updateCategory(id, body);
  
  if (!updatedCategory) {
    return {
      success: false,
      message: '分类不存在'
    };
  }
  
  return {
    success: true,
    data: updatedCategory
  };
});
