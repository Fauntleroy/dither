import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

firebase.initializeApp({
  apiKey: 'AIzaSyDriffF4c33V459hiSyEkFmUZAQaportrs',
  databaseURL: 'not-firebase-58b83.firebaseapp.com',
  storageBucket: 'not-firebase-58b83.appspot.com',
  projectId: 'not-firebase-58b83'
});

export default firebase;
export const firestore = firebase.firestore;
export const firestoreDb = firebase.firestore();