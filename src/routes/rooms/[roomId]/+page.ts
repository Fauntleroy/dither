import type { Load, LoadEvent } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';

export function load({ params }: LoadEvent): Load {
	if (!params.roomId) {
		throw error(404, 'Room not found');
	}

	const pageData = {
		roomId: params.roomId
	};

	return pageData;
}
