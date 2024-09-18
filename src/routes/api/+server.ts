import { connectDB } from '$lib/db.server';
import { type RequestHandler } from '@sveltejs/kit';
import Instance from '$lib/types/Instance';

export const GET: RequestHandler = async () => {
	await connectDB();

	const instance = await Instance.findOne({});

	return new Response(JSON.stringify({ instance }));
};
