import mongoose, { Schema } from 'mongoose';

export interface UserDocument {
	_id: string;
	email: string;
	username: string;
	password: string;
	admin: boolean;
	suspended: boolean;
}

const UserSchema = new Schema<UserDocument>({
	_id: { type: String, required: true },
	email: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	admin: { type: Boolean, required: false, default: false },
	suspended: { type: Boolean, required: false, default: false }
});

const User = mongoose.models?.user || mongoose.model<UserDocument>('user', UserSchema);

export default User;
