export {};

import csv from 'csv-parser';
import fs from 'fs';
import Data from '../models/dataModel';
import path from 'path';

export const csvImporter = async (filePath: string): Promise<string> => {
  const results: any[] = [];
  
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(`CSV file not found: ${filePath}`);
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          if (results.length === 0) {
            return resolve('CSV file is empty, no data imported');
          }
          
          // 插入数据到MongoDB
          await Data.insertMany(results);
          resolve(`Successfully imported ${results.length} records`);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
};