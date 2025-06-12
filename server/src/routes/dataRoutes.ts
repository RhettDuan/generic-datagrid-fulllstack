export {};

import express from 'express';
import multer from 'multer';
import {
  getData,
  getColumns,
  searchData,
  filterData,
  getDataItem,
  deleteDataItem,
  importCsv
} from '../controllers/dataController';

const router = express.Router();
const upload = multer();

// 数据操作路由
router.get('/', getData);
router.get('/columns', getColumns);
router.get('/search', searchData);
router.get('/filter', filterData);
router.get('/:id', getDataItem);
router.delete('/:id', deleteDataItem);

// CSV导入路由
router.post('/import', upload.single('file'), importCsv);

export default router;