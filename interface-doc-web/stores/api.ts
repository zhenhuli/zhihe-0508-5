import { defineStore } from 'pinia';
import type { ApiInterface, ApiCategory } from '~/types';

interface ApiState {
  interfaces: ApiInterface[];
  categories: ApiCategory[];
  loading: boolean;
  currentInterface: ApiInterface | null;
  debugResult: any | null;
  debugLoading: boolean;
}

export const useApiStore = defineStore('api', {
  state: (): ApiState => ({
    interfaces: [],
    categories: [],
    loading: false,
    currentInterface: null,
    debugResult: null,
    debugLoading: false
  }),

  actions: {
    async fetchInterfaces() {
      this.loading = true;
      try {
        const response = await $fetch('/api/apis');
        this.interfaces = response.data || [];
      } catch (error) {
        console.error('Failed to fetch interfaces:', error);
        this.interfaces = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await $fetch('/api/categories');
        this.categories = response.data || [];
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.categories = [];
      }
    },

    async fetchInterfaceById(id: string) {
      this.loading = true;
      try {
        const response = await $fetch(`/api/apis/${id}`);
        this.currentInterface = response.data || null;
        return this.currentInterface;
      } catch (error) {
        console.error('Failed to fetch interface:', error);
        this.currentInterface = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createInterface(api: Omit<ApiInterface, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const response = await $fetch('/api/apis', {
          method: 'POST',
          body: api
        });
        await this.fetchInterfaces();
        return response.data;
      } catch (error) {
        console.error('Failed to create interface:', error);
        throw error;
      }
    },

    async updateInterface(id: string, updates: Partial<ApiInterface>) {
      try {
        const response = await $fetch(`/api/apis/${id}`, {
          method: 'PUT',
          body: updates
        });
        await this.fetchInterfaces();
        return response.data;
      } catch (error) {
        console.error('Failed to update interface:', error);
        throw error;
      }
    },

    async deleteInterface(id: string) {
      try {
        await $fetch(`/api/apis/${id}`, {
          method: 'DELETE'
        });
        await this.fetchInterfaces();
        return true;
      } catch (error) {
        console.error('Failed to delete interface:', error);
        throw error;
      }
    },

    async toggleFavorite(id: string) {
      try {
        const response = await $fetch(`/api/apis/${id}/favorite`, {
          method: 'POST'
        });
        const index = this.interfaces.findIndex(api => api.id === id);
        if (index !== -1) {
          this.interfaces[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        throw error;
      }
    },

    async createCategory(category: Omit<ApiCategory, 'id' | 'createdAt'>) {
      try {
        const response = await $fetch('/api/categories', {
          method: 'POST',
          body: category
        });
        await this.fetchCategories();
        return response.data;
      } catch (error) {
        console.error('Failed to create category:', error);
        throw error;
      }
    },

    async debugInterface(api: ApiInterface) {
      this.debugLoading = true;
      this.debugResult = null;
      try {
        const response = await $fetch('/api/debug', {
          method: 'POST',
          body: {
            method: api.method,
            path: api.path,
            parameters: api.parameters,
            responseExample: api.responseExample
          }
        });
        this.debugResult = response.data;
        return this.debugResult;
      } catch (error) {
        console.error('Failed to debug interface:', error);
        throw error;
      } finally {
        this.debugLoading = false;
      }
    },

    clearDebugResult() {
      this.debugResult = null;
    }
  },

  getters: {
    favoriteInterfaces: (state) => {
      return state.interfaces.filter(api => api.isFavorite);
    },

    getInterfacesByCategory: (state) => (categoryId: string | null) => {
      if (!categoryId) {
        return state.interfaces.filter(api => !api.categoryId);
      }
      return state.interfaces.filter(api => api.categoryId === categoryId);
    },

    getCategoryById: (state) => (id: string) => {
      return state.categories.find(cat => cat.id === id);
    }
  }
});
