import type { LoadEvent } from '@sveltejs/kit';

import { error } from '@sveltejs/kit';

export function load({ params }: LoadEvent) {
	if (!params.roomId) {
		throw error(404, 'Room not found');
	}

	return { roomId: params.roomId };
}
