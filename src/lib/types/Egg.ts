import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface EggVariable {
	name: string;
	description: string;
	env_variable: string;
	default_value: string | null;
	user_viewable: boolean;
	user_editable: boolean;
	field_type: string;
}

export interface EggDocument {
	_id: number;
	nestId: number;
	/* We use pterodactyl eggs */
	_comment: string;
	meta: {
		version: string;
		update_url: string | null;
	};
	exported_at: string;
	name: string;
	author: string;
	description: string;
	docker_images: Map<string, string>;
	startup: string;
	config: {
		stop: string;
	};
	scripts: {
		installation: {
			script: string;
			container: string;
			entrypoint: string;
		};
	};
	variables: EggVariable[];
}

const EggSchema = new Schema<EggDocument>({
	_id: { type: Number, required: false, default: 0 },
	nestId: { type: Number, required: true },
	_comment: { type: String, required: true },
	meta: {
		version: { type: String, required: true },
		update_url: { type: String, required: false, default: null }
	},
	exported_at: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	docker_images: { type: Object, required: true },
	startup: { type: String, required: true },
	config: {
		stop: { type: String, required: true }
	},
	scripts: {
		installation: {
			script: { type: String, required: true },
			container: { type: String, required: true },
			entrypoint: { type: String, required: true }
		}
	},
	variables: [
		{
			name: { type: String, required: true },
			description: { type: String, required: true },
			env_variable: { type: String, required: true },
			default_value: { type: String, required: false, default: null },
			user_viewable: { type: Boolean, required: true },
			user_editable: { type: Boolean, required: true },
			field_type: { type: String, required: true }
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
