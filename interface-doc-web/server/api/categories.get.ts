import { getCategories } from '~/server/storage/apis';

export default defineEventHandler(() => {
  const categories = getCategories();
  return {
    success: true,
    data: categories
  };
});
