import { getInterfaces } from '~/server/storage/apis';

export default defineEventHandler(() => {
  const interfaces = getInterfaces();
  return {
    success: true,
    data: interfaces
  };
});
