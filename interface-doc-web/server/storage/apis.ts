import type { ApiInterface, ApiCategory } from '~/types';

let interfaces: ApiInterface[] = [
  {
    id: '1',
    name: '获取用户信息',
    path: '/api/users/:id',
    method: 'GET',
    categoryId: '1',
    description: '根据用户ID获取用户详细信息',
    parameters: [
      {
        id: 'param1',
        name: 'id',
        type: 'string',
        required: true,
        description: '用户ID',
        location: 'path'
      }
    ],
    responseExample: JSON.stringify({
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      createdAt: '2024-01-01T00:00:00Z'
    }, null, 2),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isFavorite: true
  },
  {
    id: '2',
    name: '创建用户',
    path: '/api/users',
    method: 'POST',
    categoryId: '1',
    description: '创建新用户',
    parameters: [
      {
        id: 'param2',
        name: 'name',
        type: 'string',
        required: true,
        description: '用户名称',
        location: 'body'
      },
      {
        id: 'param3',
        name: 'email',
        type: 'string',
        required: true,
        description: '用户邮箱',
        location: 'body'
      }
    ],
    responseExample: JSON.stringify({
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      createdAt: '2024-01-02T00:00:00Z'
    }, null, 2),
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    isFavorite: false
  },
  {
    id: '3',
    name: '获取订单列表',
    path: '/api/orders',
    method: 'GET',
    categoryId: '2',
    description: '获取订单列表，支持分页',
    parameters: [
      {
        id: 'param4',
        name: 'page',
        type: 'number',
        required: false,
        description: '页码，默认1',
        location: 'query'
      },
      {
        id: 'param5',
        name: 'limit',
        type: 'number',
        required: false,
        description: '每页数量，默认10',
        location: 'query'
      }
    ],
    responseExample: JSON.stringify({
      data: [
        {
          id: 'order1',
          userId: '1',
          total: 100.00,
          status: 'pending'
        }
      ],
      total: 1,
      page: 1,
      limit: 10
    }, null, 2),
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    isFavorite: true
  }
];

let categories: ApiCategory[] = [
  {
    id: '1',
    name: '用户管理',
    description: '用户相关的接口',
    color: '#3b82f6',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '订单管理',
    description: '订单相关的接口',
    color: '#10b981',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '产品管理',
    description: '产品相关的接口',
    color: '#f59e0b',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const getInterfaces = () => {
  return [...interfaces];
};

export const getInterfaceById = (id: string) => {
  return interfaces.find(api => api.id === id) || null;
};

export const createInterface = (api: Omit<ApiInterface, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const newApi: ApiInterface = {
    ...api,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  interfaces.push(newApi);
  return newApi;
};

export const updateInterface = (id: string, updates: Partial<ApiInterface>) => {
  const index = interfaces.findIndex(api => api.id === id);
  if (index === -1) return null;
  
  interfaces[index] = {
    ...interfaces[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return interfaces[index];
};

export const deleteInterface = (id: string) => {
  const index = interfaces.findIndex(api => api.id === id);
  if (index === -1) return false;
  
  interfaces.splice(index, 1);
  return true;
};

export const toggleFavorite = (id: string) => {
  const api = getInterfaceById(id);
  if (!api) return null;
  
  return updateInterface(id, { isFavorite: !api.isFavorite });
};

export const getCategories = () => {
  return [...categories];
};

export const getCategoryById = (id: string) => {
  return categories.find(cat => cat.id === id) || null;
};

export const createCategory = (category: Omit<ApiCategory, 'id' | 'createdAt'>) => {
  const newCategory: ApiCategory = {
    ...category,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = (id: string, updates: Partial<ApiCategory>) => {
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) return null;
  
  categories[index] = {
    ...categories[index],
    ...updates
  };
  return categories[index];
};

export const deleteCategory = (id: string) => {
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) return false;
  
  categories.splice(index, 1);
  return true;
};
