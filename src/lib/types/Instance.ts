import mongoose, { Schema } from 'mongoose';

export interface InstanceDocument {
	_id: string;
	name: string;
	enableRegistration: boolean;
	maintenance: boolean;
	secret: string;
}

const InstanceSchema = new Schema<InstanceDocument>({
	name: { type: String, required: false, default: 'CylexPanel' },
	enableRegistration: { type: Boolean, required: false, default: false },
	maintenance: { type: Boolean, required: false, default: false },
	secret: { type: String, required: true }
});

const Instance =
	mongoose.models?.instance ||
	mongoose.model<InstanceDocument>('instance', InstanceSchema, 'instance');

export default Instance;
