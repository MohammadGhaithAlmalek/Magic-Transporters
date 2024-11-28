import mongoose, { Schema, Document } from 'mongoose';

interface IMoverItem extends Document {
  mover_id: mongoose.Types.ObjectId;
  item_id: mongoose.Types.ObjectId;
  quantity: number;
  action: 'Loaded' | 'Unloaded'; 
  created_at: Date;  
}

const MoverItemSchema: Schema = new Schema({
  mover_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MagicMover', required: true },
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MagicItem', required: true },
  quantity: { type: Number, required: true },
  action: { 
    type: String, 
    required: true, 
    enum: ['Loaded', 'Unloaded'], 
  }, 
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IMoverItem>('MoverItem', MoverItemSchema);