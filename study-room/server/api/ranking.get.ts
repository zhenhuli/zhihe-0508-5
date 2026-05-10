import { getUserRanking } from '~/server/storage/rooms';

export default defineEventHandler(() => {
  const rankings = getUserRanking();
  return {
    success: true,
    data: rankings,
  };
});
