import axios from 'axios';

const API_URL = 'http://localhost:4000/api';//'http://localhost:5000/api';

// 创建 Axios 实例
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取所有数据
export const fetchData = async (): Promise<any[]> => {
  try {
    const response = await api.get('/data');
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

// 获取所有列名
export const getColumns = async (): Promise<string[]> => {
  try {
    const response = await api.get('/data/columns');
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch columns');
  }
};

// 搜索数据
export const searchData = async (query: string): Promise<any[]> => {
  try {
    const response = await api.get('/data/search', { params: { q: query } });
    return response.data.data;
  } catch (error) {
    throw new Error('Search failed');
  }
};

// 过滤数据
export const filterData = async (
  column: string, 
  operator: string, 
  value: string
): Promise<any[]> => {
  try {
    const response = await api.get('/data/filter', { 
      params: { column, operator, value } 
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Filter failed');
  }
};

// 获取单个数据项
export const fetchItem = async (id: string): Promise<any> => {
    console.log('Calling API with ID 👉', id);
  try {
    console.log('Calling API with ID 👉', id);
    const response = await api.get(`/data/${id}`);
    console.log('📦 Raw API response:', response); // 👈 关键！
    return response.data.data;
  } catch (error) {
    console.error('API call failed for ID 👉', id);
    throw new Error('Failed to fetch item');
  }
};

// 删除数据项
export const deleteDataItem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/data/${id}`);
  } catch (error) {
    throw new Error('Failed to delete item');
  }
};

// 上传CSV文件
export const uploadCsv = async (
  formData: FormData, 
  onUploadProgress?: (progressEvent: any) => void
): Promise<void> => {
  try {
    await api.post('/data/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  } catch (error) {
    throw new Error('CSV upload failed');
  }
};