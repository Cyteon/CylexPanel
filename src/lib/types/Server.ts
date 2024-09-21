import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface ServerDocument {
	_id: number;
	ownerId: number;
	name: string;
	description: string;
	node: string;
	ports: number[];
}

const ServerSchema = new Schema<ServerDocument>({
	_id: { type: Number, required: false, default: 0 },
	name: { type: String, required: true },
	location: { type: String, required: true },
	fqdn: { type: String, required: true },
	port: { type: Number, required: true },
	adminKey: { type: String, required: true },
	secure: { type: Boolean, required: true }
});

ServerSchema.pre('save', async function (next) {
	if (this.isNew) {
		this._id = await getNextSequence('server');
	}
	next();
});

const Server = mongoose.models?.server || mongoose.model<ServerDocument>('server', ServerSchema);

export default server;
