import { type RequestHandler, error } from '@sveltejs/kit';
import { connectDB } from '$lib/db.server';
import User from '$lib/types/User';
import Session from '$lib/types/Session';
import Instance from '$lib/types/Instance';
import bcrypt from 'bcrypt';
import { typeid } from 'typeid-js';

export const POST: RequestHandler = async ({ request }) => {
	const { email, username, password } = await request.json();

	await connectDB();

	const EmailTaken = await User.findOne({ email: email });
	if (EmailTaken) {
		error(400, {
			message: 'Email already registered'
		});
	}

	const UsernameTaken = await User.findOne({ username: username });
	if (UsernameTaken) {
		error(400, {
			message: 'Username already taken'
		});
	}

	const instance = await Instance.findOne({});
	if (!instance?.enableRegistration) {
		error(400, {
			message: 'Registration is disabled'
		});
	}

	const hashed = await bcrypt.hash(password, 12);

	const user = new User({
		email: email,
		username: username,
		password: hashed
	});
	await user.save();

	const bytes = new Uint8Array(48);
	crypto.getRandomValues(bytes);
	const token = btoa(String.fromCharCode(...bytes));

	const session = new Session({
		_id: typeid('session').toString(),
		token: token,
		user: id,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
	});

	await session.save();

	return new Response(JSON.stringify({ message: 'User registered', user: user, session: session }));
};
