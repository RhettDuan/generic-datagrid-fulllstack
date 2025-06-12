export {}; // 👈 没有默认导出/类/函数/常量声明时必须写

import { Request, Response } from 'express';
import Data from '../models/dataModel';
import { 
  ApiResponse, 
  GenericData,
  SearchParams,
  FilterParams,
  DeleteResponse
} from '../types';

// 获取所有数据
export const getData = async (
  req: Request,
  res: Response<ApiResponse<GenericData[]>>
): Promise<void> => {
  try {
    const docs = await Data.find({}).select('-__v');
    // 转换每份文档
    const data: GenericData[] = docs.map(doc => {
      const obj = doc.toObject();
      return {
        ...obj,
        _id: obj._id.toString() // 关键转换
      };
    });
    res.json({ success: true, data });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch data',
      message: err.message
    });
  }
};

// 获取所有列名
export const getColumns = async (
  req: Request,
  res: Response<ApiResponse<string[]>>
): Promise<void> => {
  try {
    const sample = await Data.findOne().select('-_id');
    if (!sample) {
      res.json({ success: true, data: [] });
      return;
    }
    
    const sampleObj = sample.toObject();

    //console.log('SampleObj:', sampleObj);

    const keys = Object.keys(sampleObj).filter(
      key => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)
    );
    
    res.json({ success: true, data: keys });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: 'Failed to fetch columns',
      message: err.message
    });
  }
};

// 搜索数据
export const searchData = async (
  req: Request<{}, {}, {}, SearchParams>,
  res: Response<ApiResponse<GenericData[]>>
): Promise<void> => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400).json({ 
      success: false, 
      error: 'Search query is required' 
    });
    return;
  }
  
  try {
    await Data.collection.createIndex({ '$**': 'text' });
    
    const docs = await Data.find(
      { $text: { $search: q } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .select('-__v');

    // 转换每份文档
    const data: GenericData[] = docs.map(doc => {
      const obj = doc.toObject();
      return {
        ...obj,
        _id: obj._id.toString() // 关键转换
      };
    });
    
    res.json({ success: true, data: data });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: err.message
    });
  }
};

// 过滤数据
export const filterData = async (
  req: Request<{}, {}, {}, FilterParams>,
  res: Response<ApiResponse<GenericData[]>>
): Promise<void> => {
  const { column, operator, value } = req.query;
  
  if (!column || !operator) {
    res.status(400).json({
      success: false,
      error: 'Column and operator are required'
    });
    return;
  }
  
  try {
    let query: Record<string, any> = {};
    const filterValue = value || '';
    
    switch (operator) {
      case 'contains':
        query[column] = { $regex: filterValue, $options: 'i' };
        break;
      case 'equals':
        query[column] = filterValue;
        break;
      case 'startsWith':
        query[column] = { $regex: `^${filterValue}`, $options: 'i' };
        break;
      case 'endsWith':
        query[column] = { $regex: `${filterValue}$`, $options: 'i' };
        break;
      case 'isEmpty':
        query[column] = { $in: ['', null] };
        break;
      case 'greaterThan':
        query[column] = { $gt: isNaN(Number(filterValue)) ? filterValue : Number(filterValue) };
        break;
      case 'lessThan':
        query[column] = { $lt: isNaN(Number(filterValue)) ? filterValue : Number(filterValue) };
        break;
      default:
        res.status(400).json({
          success: false,
          error: 'Invalid operator'
        });
        return;
    }
    
    const docs = await Data.find(query).select('-__v');
    // 转换每份文档
    const data: GenericData[] = docs.map(doc => {
      const obj = doc.toObject();
      return {
        ...obj,
        _id: obj._id.toString() // 关键转换
      };
    });
    
    res.json({ success: true, data: data });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: 'Filter failed',
      message: err.message
    });
  }
};

// 获取单个数据项
export const getDataItem = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<GenericData>>
): Promise<void> => {
  try {
    const item = await Data.findById(req.params.id).select('-__v');
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    const obj = item.toObject(); 
    const data: GenericData = {
      ...obj,
      _id: obj._id.toString()
    };

    //const data: GenericData[] = item.map((item: { toObject: () => any; }) => {
    // const obj = item.toObject();
    //  return {
    //    ...obj,
    //    _id: obj._id.toString() // 关键转换
    //  };
    //});
    res.json({ success: true, data: data });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item',
      message: err.message
    });
  }
};

// 删除数据项
export const deleteDataItem = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<DeleteResponse>>
): Promise<void> => {
  try {
    const deletedItem = await Data.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: { 
        message: 'Item deleted successfully',
        count: 1
      }
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: 'Failed to delete item',
      message: err.message
    });
  }
};

// 导入CSV数据
export const importCsv = async (
  req: Request,
  res: Response<ApiResponse<DeleteResponse>>
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
      return;
    }

    const results: any[] = [];
    const buffer = req.file.buffer;
    const { Readable } = require('stream');
    const stream = Readable.from(buffer.toString());
    
    // 解析CSV
    const csv = require('csv-parser');
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve())
        .on('error', reject);
    });

    // 插入数据库
    const inserted = await Data.insertMany(results);
    
    res.json({
      success: true,
      data: { 
        message: 'CSV imported successfully',
        count: inserted.length
      }
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: 'Import failed',
      message: err.message
    });
  }
};