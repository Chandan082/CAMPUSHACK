import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date },
    location: { type: String, trim: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
