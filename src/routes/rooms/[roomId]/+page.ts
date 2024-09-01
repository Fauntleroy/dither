import type { LoadEvent } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { error } from '@sveltejs/kit';

export function load({ params }: LoadEvent): PageLoad {
	if (!params.roomId) {
		throw error(404, 'Room not found');
	}

	return {
		roomId: params.roomId
	};
}
