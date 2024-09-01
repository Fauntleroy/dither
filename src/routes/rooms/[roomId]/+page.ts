import type { LoadEvent } from '@sveltejs/kit';

export interface PageData {
	roomId: string | undefined;
}

export function load({ params }: LoadEvent): Promise<PageData> {
	// TODO throw to an error page instead?
	console.log('>>>>>>>>>>>>>>>>> XXXXXX OBVIOUS XXXXXXX - Load...', params);
	return {
		roomId: params.roomId
	};
}
