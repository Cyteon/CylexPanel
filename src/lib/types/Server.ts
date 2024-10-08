import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface ResourceDocument {
	ram: number;
	cpu: number;
	disk: number;
	allocations: number;
}

export interface ServerDocument {
	_id: number;
	ownerId: number;
	name: string;
	description: string;
	node: string;
	ports: number[];
	suspended: boolean;
	eggId: number;
	resources: ResourceDocument;
}

const ServerSchema = new Schema<ServerDocument>({
	_id: { type: Number, required: false, default: 0 },
	ownerId: { type: Number, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	node: { type: String, required: true },
	ports: { type: [Number], required: true },
	suspended: { type: Boolean, required: true },
	eggId: { type: Number, required: true },
	resources: {
		ram: { type: Number, required: true },
		cpu: { type: Number, required: true },
		disk: { type: Number, required: true },
		allocations: { type: Number, required: true }
	}
});

ServerSchema.pre('save', async function (next) {
	if (this.isNew) {
		this._id = await getNextSequence('server');
	}
	next();
});

const Server = mongoose.models?.server || mongoose.model<ServerDocument>('server', ServerSchema);

export default Server;
