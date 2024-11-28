import mongoose, { Schema, Document } from 'mongoose';

interface ILog extends Document {
  mover_id: mongoose.Types.ObjectId;
  action: 'Loaded' | 'On-Mission' | 'Unloaded';
  timestamp: Date;
}

const LogSchema: Schema = new Schema({
  moverItem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MoverItem', required: true },
  action: { 
    type: String, 
    required: true, 
    enum: ['Loaded', 'On-Mission', 'Unloaded'], 
  },
  timestamp: { type: Date, default: Date.now }, // Automatically sets the current date and time
});

export default mongoose.model<ILog>('Log', LogSchema);
