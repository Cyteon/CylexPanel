import mongoose, { Schema } from 'mongoose';

export interface NodeDocument {
	_id: string;
	name: string;
	location: string;
	adminKey: string;
}

const NodeSchema = new Schema<NodeDocument>({
	_id: { type: String, required: true },
	name: { type: String, required: true }
});

const Node = mongoose.models?.node || mongoose.model<NodeDocument>('node', NodeSchema);

export default Node;
