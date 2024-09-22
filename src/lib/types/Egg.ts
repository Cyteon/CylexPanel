import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface EggInstallDocument {
	script: string;
	container: string;
}

export interface EggVariableDocument {
	name: string;
	description: string;
	key: string;
	value: string;
	required: boolean;
	editable: boolean;
	viewable: boolean;
}

export interface EggDocument {
	_id: number;
	nestId: number;
	name: string;
	description: string;
	startupCommand: string;
	stopCommand: string;
	dockerImages: string[];
	install: EggInstallDocument;
	variables?: EggVariableDocument[];
}

const EggSchema = new Schema<EggDocument>({
	_id: { type: Number, required: false, default: 0 },
	nestId: { type: Number, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	startupCommand: { type: String, required: true },
	stopCommand: { type: String, required: true },
	dockerImages: { type: [String], required: true },
	install: {
		script: { type: String, required: true },
		container: { type: String, required: true }
	},
	variables: [
		{
			name: { type: String, required: true },
			description: { type: String, required: true },
			key: { type: String, required: true },
			value: { type: String, required: true }
		}
	]
});

EggSchema.pre('save', async function (next) {
	if (this.isNew) {
		this._id = await getNextSequence('nest');
	}
	next();
});

const Egg = mongoose.models?.egg || mongoose.model<EggDocument>('egg', EggSchema);

export default Egg;
