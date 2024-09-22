import { type RequestHandler, error } from '@sveltejs/kit';

import Egg from '$lib/types/Egg';
import Nest from '$lib/types/Nest';
import { verifyRequest } from '$lib/api/verifyRequest.server';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';

export const GET: RequestHandler = async ({ request, params }) => {
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

	const eggs = await Egg.find({ nest: parseInt(params.id || '0') });
	const nest = await Nest.findById(parseInt(params.id || '0'));

	return new Response(JSON.stringify({ eggs: eggs, nest: nest }));
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

	const data = await request.json();

	if (!data) {
		error(400, {
			message: 'Bad Request'
		});
	}

	const egg = new Egg(data);

	await egg.save();

	return new Response(JSON.stringify({ egg: egg, message: 'Egg created' }));
};
