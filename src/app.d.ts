// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface ChatMessageT {
		createdAt: Date;
		imageBlob: string;
		text?: string;
	}

	interface RoomT {
		createdAt: Date;
		name: string;
		messages: ChatMessageT[];
	}
}

export {};
