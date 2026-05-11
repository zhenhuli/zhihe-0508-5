export interface ApiParameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  location: 'query' | 'body' | 'path' | 'header';
}

export interface ApiInterface {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  categoryId: string | null;
  description: string;
  parameters: ApiParameter[];
  responseExample: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}
