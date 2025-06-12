// server/src/types/index.ts

// 通用数据结构
export type GenericData = {
  [key: string]: any; // 允许任意额外字段
};

// 后端API响应格式
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 搜索参数类型
export interface SearchParams {
  q: string;
}

// 过滤参数类型
export interface FilterParams {
  column: string;
  operator: string;
  value: string;
}

// 删除响应类型
export interface DeleteResponse {
  message: string;
  count: number;
}