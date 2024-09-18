import mongoose from 'mongoose';

const MONOGO_URI = import.meta.env.VITE_MONGODB_URI as string;

export const connectDB = async () => {
	try {
		const { connection } = await mongoose.connect(MONOGO_URI);

		if (connection.readyState === 1) {
			return Promise.resolve(true);
		}
	} catch (error) {
		console.log(error);
		return Promise.reject(error);
	}
};
