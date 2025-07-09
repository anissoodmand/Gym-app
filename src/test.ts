import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const TestModel = mongoose.model('Test', testSchema);
