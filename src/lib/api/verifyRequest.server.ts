import { connectDB } from '$lib/db.server';
import Session from '$lib/types/Session';
import User from '$lib/types/User';

export async function verifyRequest(request: Request) {
	const token = request.headers.get('Authorization');

	if (!token) {
		return null;
	}

	await connectDB();

	const session = await Session.findOne({ token: token });

	if (!session) {
		return null;
	}

	const user = await User.findById(session.user);

	if (!user) {
		return null;
	}

	return user;
}
