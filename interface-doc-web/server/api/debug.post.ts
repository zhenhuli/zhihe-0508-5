export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { method, path, headers, parameters, responseExample } = body;
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let result = {};
  try {
    result = JSON.parse(responseExample);
  } catch {
    result = { message: '响应示例解析失败，返回原始数据', raw: responseExample };
  }
  
  return {
    success: true,
    data: {
      request: {
        method,
        path,
        headers: headers || {},
        parameters: parameters || []
      },
      response: {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': `mock-${Date.now()}`
        },
        body: result
      },
      timing: {
        total: Math.floor(Math.random() * 500) + 100
      }
    }
  };
});
