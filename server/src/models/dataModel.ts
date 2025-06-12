export {};

import mongoose, { Document, Schema, Types } from 'mongoose';

interface IGenericData extends Document {
   _id: Types.ObjectId; // 关键修改
  [key: string]: any;
}

const DataSchema = new Schema<IGenericData>({}, { 
  strict: false, 
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      if (ret._id && typeof ret._id.toString === 'function') {
        ret._id = ret._id.toString();
      }
      delete ret.__v;
      return ret;
    }
  } 
});

export default mongoose.model<IGenericData>('Data', DataSchema);