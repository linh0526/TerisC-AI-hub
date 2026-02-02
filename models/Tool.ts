import mongoose, { Schema, model, models } from 'mongoose';

const ToolSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  tags: [String],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Tool = models.Tool || model('Tool', ToolSchema);

export default Tool;
