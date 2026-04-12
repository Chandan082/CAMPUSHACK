import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionCode: { type: String, required: true, trim: true, index: true },
    course: { type: String, trim: true },
    checkedInAt: { type: Date, default: Date.now },
    method: { type: String, enum: ['qr', 'manual'], default: 'qr' },
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, sessionCode: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
