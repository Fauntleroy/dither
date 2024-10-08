// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface ChatMessageT {
		id: string;
		createdAt: Date;
		imageUrl: string;
		text?: string;
	}

	interface RoomT {
		id: string;
		createdAt: Date;
		name: string;
		messages: ChatMessageT[];
	}
}
