import { createCategory } from '~/server/storage/apis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newCategory = createCategory(body);
  return {
    success: true,
    data: newCategory
  };
});
