import mongoose, { Schema } from 'mongoose';

export interface SessionDocument {
	_id: string;
	token: string;
	user: string;
	expires: Date;
}

const SessionSchema = new Schema<SessionDocument>({
	_id: { type: String, required: true },
	token: { type: String, required: true },
	user: { type: String, required: true },
	expires: { type: Date, required: true }
});

const Session =
	mongoose.models?.session || mongoose.model<SessionDocument>('session', SessionSchema);

export default Session;
