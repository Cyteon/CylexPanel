import { type RequestHandler, error } from '@sveltejs/kit';
import { connectDB } from '$lib/db.server';
import Session from '$lib/types/Session';
import User from '$lib/types/User';
import Node from '$lib/types/Node';
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

	const nodes = await Node.find();

	return new Response(JSON.stringify({ nodes: nodes }));
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

	const { name, location, fqdn, port, secure } = await request.json();

	if (!name || !location || !fqdn || !port || typeof secure !== 'boolean') {
		error(400, {
			message: 'Bad Request'
		});
	}

	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	const adminKey = btoa(String.fromCharCode(...bytes));

	const node = new Node({
		name: name,
		location: location,
		fqdn: fqdn,
		port: port,
		secure: secure,
		adminKey: adminKey
	});

	const res = await fetch(`${secure ? 'https' : 'http'}://${fqdn}:${port}/api/setup`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Origin: request.headers.get('Origin') || request.headers.get('origin')
		},
		body: JSON.stringify({
			name: name,
			location: location,
			adminKey: adminKey
		})
	});
	const body = await res.json();

	if (!res.ok) {
		error(500, {
			message: body.error
		});
	}

	await node.save();

	return new Response(JSON.stringify({ node: node, message: 'Node added' }));
};
