import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

import { env } from '$env/dynamic/public';

export const firebaseApp = initializeApp({
	apiKey: env.PUBLIC_FIREBASE_API_KEY,
	databaseURL: 'not-firebase-58b83.firebaseapp.com',
	storageBucket: 'not-firebase-58b83.appspot.com',
	projectId: 'not-firebase-58b83'
});
