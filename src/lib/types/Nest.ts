import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface NestDocument {
	_id: number;
	name: string;
	description: string;
}

const NestSchema = new Schema<NestDocument>({
	_id: { type: Number, required: false, default: 0 },
	name: { type: String, required: true },
	description: { type: String, required: true }
});

NestSchema.pre('save', async function (next) {
	if (this.isNew) {
		this._id = await getNextSequence('nest');
	}
	next();
});

const Nest = mongoose.models?.nest || mongoose.model<NestDocument>('nest', NestSchema);

export default Nest;
