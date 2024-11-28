import mongoose, { Schema, Document } from 'mongoose';

interface IMagicItem extends Document {
  name: string;
  weight: number;
}

const MagicItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
});

export default mongoose.model<IMagicItem>('MagicItem', MagicItemSchema);
