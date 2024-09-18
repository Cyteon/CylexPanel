import { type RequestHandler, error } from '@sveltejs/kit';
import { connectDB } from '$lib/db.server';
import User from '$lib/types/User';
import Session from '$lib/types/Session';
import bcrypt from 'bcrypt';
import { typeid } from 'typeid-js';

export const POST: RequestHandler = async ({ request }) => {
	const { identifier, password } = await request.json();

	await connectDB();

	let user: any | null = null;

	if (identifier.includes('@')) {
		user = await User.findOne({ email: identifier });
	} else {
		user = await User.findOne({ username: identifier });
	}

	if (!user) {
		error(400, {
			message: 'Invalid username or email'
		});
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		error(401, {
			message: 'Invalid password'
		});
	}

	const bytes = new Uint8Array(48);
	crypto.getRandomValues(bytes);
	const token = btoa(String.fromCharCode(...bytes));

	const session = new Session({
		_id: typeid('session').toString(),
		token: token,
		user: user._id,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
	});

	await session.save();

	return new Response(JSON.stringify({ message: 'Logged in', session: session, user: user }));
};
