import mongoose, { Schema, Document } from 'mongoose';

interface IMagicMover extends Document {
  name: string;
  max_weight: number;
  status: 'Resting' | 'Loading' | 'On-Mission';
}

const MagicMoverSchema: Schema = new Schema({
  max_weight: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Resting', 'Loading', 'On-Mission'],
    default: 'Resting',
  },
});

export default mongoose.model<IMagicMover>('MagicMover', MagicMoverSchema);