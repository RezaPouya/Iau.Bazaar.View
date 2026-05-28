import type { ApiResponse } from '~/types/api';

export const useApi = () => {
  const { $api } = useNuxtApp();

  const get = async <T>(url: string, params = {}) => {
    const response = await $api.get<ApiResponse<T>>(url, { params });

    return response.data.data;
  };

  const post = async <T>(url: string, body = {}) => {
    const response = await $api.post<ApiResponse<T>>(url, body);

    return response.data.data;
  };

  const put = async <T>(url: string, body = {}) => {
    const response = await $api.put<ApiResponse<T>>(url, body);

    return response.data.data;
  };

  const remove = async <T>(url: string) => {
    const response = await $api.delete<ApiResponse<T>>(url);

    return response.data.data;
  };

  return {
    get,
    post,
    put,
    remove,
  };
};
