import { type RequestHandler, error } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { typeid } from 'typeid-js';

import { connectDB } from '$lib/db.server';
import Instance from '$lib/types/Instance';
import User from '$lib/types/User';

export const POST: RequestHandler = async ({ request }) => {
	const { instanceName, enableRegistration, email, username, password } = await request.json();

	await connectDB();

	const instanceExists = await Instance.findOne({});

	if (instanceExists) {
		error(400, {
			message: 'Instance already set up'
		});
	}

	let instance: any;

	const bytes = new Uint8Array(48);
	crypto.getRandomValues(bytes);
	const secret = btoa(String.fromCharCode(...bytes));

	if (instanceName) {
		instance = new Instance({
			name: instanceName,
			enableRegistration: enableRegistration,
			secret: secret
		});
	} else {
		instance = new Instance({
			enableRegistration: enableRegistration,
			secret: secret
		});
	}

	await instance.save();

	const id = typeid('user').toString();

	const hashed = await bcrypt.hash(password, 12);

	const user = new User({
		_id: id,
		email: email,
		username: username,
		password: hashed,
		admin: true
	});
	await user.save();

	return new Response(JSON.stringify({ message: 'Instance and user registered' }));
};
