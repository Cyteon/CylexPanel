import { type RequestHandler, error } from '@sveltejs/kit';
import { connectDB } from '$lib/db.server';
import Session from '$lib/types/Session';
import User from '$lib/types/User';

export const POST: RequestHandler = async ({ request }) => {
	const token = request.headers.get('Authorization');

	if (!token) {
		error(401, {
			message: 'Unauthorized'
		});
	}

	await connectDB();

	const session = await Session.findOne({ token: token });

	if (!session) {
		error(401, {
			message: 'Unauthorized'
		});
	}

	const user = await User.findById(session.user);

	if (!user) {
		error(401, {
			message: 'Unauthorized'
		});
	}

	return new Response(JSON.stringify({ message: 'Authorized', session: session, user: user }));
};
