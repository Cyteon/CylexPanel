import { connectDB } from '$lib/db.server';
import { type RequestHandler, error } from '@sveltejs/kit';
import Instance from '$lib/types/Instance';

export const GET: RequestHandler = async () => {
	await connectDB();

	const instance = await Instance.findOne({});

	if (instance) {
		error(400, {
			message: 'Instance already set up'
		});
	}

	return new Response(JSON.stringify({ message: 'Ready for setup' }));
};
