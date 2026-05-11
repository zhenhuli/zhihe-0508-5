import { createInterface } from '~/server/storage/apis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const newInterface = createInterface(body);
  return {
    success: true,
    data: newInterface
  };
});
