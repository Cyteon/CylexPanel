import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface NodeDocument {
	_id: number;
	name: string;
	location: string;
	fqdn: string;
	port: number;
	adminKey: string;
	secure: boolean;
}

const NodeSchema = new Schema<NodeDocument>({
	_id: { type: Number, required: false, default: 0 },
	name: { type: String, required: true },
	location: { type: String, required: true },
	fqdn: { type: String, required: true },
	port: { type: Number, required: true },
	adminKey: { type: String, required: true },
	secure: { type: Boolean, required: true }
});

NodeSchema.pre('save', async function (next) {
	if (this.isNew) {
		this._id = await getNextSequence('node');
	}
	next();
});

const Node = mongoose.models?.node || mongoose.model<NodeDocument>('node', NodeSchema);

export default Node;
