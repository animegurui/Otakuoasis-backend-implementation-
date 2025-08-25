import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  slug: { type: String, required: true },
  episode: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('History', historySchema);
