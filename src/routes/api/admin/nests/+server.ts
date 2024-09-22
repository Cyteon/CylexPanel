import { type RequestHandler, error } from '@sveltejs/kit';

import Nest from '$lib/types/Nest';
import { verifyRequest } from '$lib/api/verifyRequest.server';

export const GET: RequestHandler = async ({ request }) => {
	const user = await verifyRequest(request);

	if (!user) {
		error(401, {
			message: 'Unauthorized'
		});
	}

	if (!user.admin) {
		error(403, {
			message: 'Forbidden'
		});
	}

	const nests = await Nest.find();

	return new Response(JSON.stringify({ nests: nests }));
};

export const PUT: RequestHandler = async ({ request }) => {
	const user = await verifyRequest(request);

	if (!user) {
		error(401, {
			message: 'Unauthorized'
		});
	}

	if (!user.admin) {
		error(403, {
			message: 'Forbidden'
		});
	}

	const { name, description } = await request.json();

	if (!name || !description) {
		error(400, {
			message: 'Bad Request'
		});
	}

	const nest = new Nest({
		name: name,
		description: description
	});

	await nest.save();

	return new Response(JSON.stringify({ nest: nest, message: 'Nest created' }));
};
