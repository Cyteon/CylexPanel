import mongoose, { Schema } from 'mongoose';

export interface CounterDocument {
	_id: string;
	seq: number;
}

const CounterSchema = new Schema<CounterDocument>({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 }
});

const Counter =
	mongoose.models?.counter || mongoose.model<CounterDocument>('counter', CounterSchema);

const getNextSequence = async (name: string): Promise<number> => {
	const doc = await Counter.findOneAndUpdate(
		{ _id: name },
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true }
	);
	return doc?.seq || 0;
};

export { Counter, getNextSequence };
