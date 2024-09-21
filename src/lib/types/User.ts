import mongoose, { Schema } from 'mongoose';
import { getNextSequence } from './Counter';

export interface UserDocument {
	_id: number;
	email: string;
	username: string;
	password: string;
	admin: boolean;
	suspended: boolean;
}

const UserSchema = new Schema<UserDocument>({
	_id: { type: Number, required: false, default: 0 },
	email: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	admin: { type: Boolean, required: false, default: false },
	suspended: { type: Boolean, required: false, default: false }
});

UserSchema.pre('save', async function (next) {
	if (this.isNew) {
		this._id = await getNextSequence('user');
	}
	next();
});

const User = mongoose.models?.user || mongoose.model<UserDocument>('user', UserSchema);

export default User;
