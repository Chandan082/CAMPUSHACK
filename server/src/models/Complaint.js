import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'resolved', 'rejected'],
      default: 'pending',
    },
    adminNotes: { type: String, trim: true },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
