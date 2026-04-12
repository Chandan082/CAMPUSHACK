import mongoose from 'mongoose';
import crypto from 'crypto';

const attendanceSessionSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, unique: true, index: true },
    title: { type: String, trim: true },
    course: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

attendanceSessionSchema.statics.generateSessionCode = function generateSessionCode() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

export default mongoose.model('AttendanceSession', attendanceSessionSchema);
