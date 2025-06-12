import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dataRoutes from './routes/dataRoutes';
import path from 'path';
import { csvImporter } from './utils/csvImporter';
import Data from './models/dataModel';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

console.log('MONGO_USER:', process.env.MONGO_USER)
console.log('MONGO_PASSWORD:', process.env.MONGO_PASSWORD)
console.log('MONGO_DB:', process.env.MONGO_DB)

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.sq6roal.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('⏳ MongoDB Connected');
    
    // 导入初始数据（如果集合为空）
    const count = await Data.countDocuments();
    if (count === 0) {
      const csvPath = path.join(__dirname, '../../data/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv');
      console.log(`📂 Importing CSV from: ${csvPath}`);
      
      try {
        const msg = await csvImporter(csvPath);
        console.log(`✅ ${msg}`);
      } catch (error) {
        console.error('❌ CSV import failed:', error);
      }
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// 设置路由
app.use('/api/data', dataRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});