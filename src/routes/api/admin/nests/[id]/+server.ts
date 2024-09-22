import { type RequestHandler, error } from '@sveltejs/kit';

import Egg from '$lib/types/Egg';
import Nest from '$lib/types/Nest';
import { verifyRequest } from '$lib/api/verifyRequest.server';

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
