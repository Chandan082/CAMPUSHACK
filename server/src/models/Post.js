import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, trim: true },
    contact: { type: String, trim: true },
    status: {
      type: String,
      enum: ['open', 'resolved', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
