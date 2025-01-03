import admin from 'firebase-admin';
export type FirebaseApp = admin.app.App;
export const FirebaseApp = Symbol('FirebaseApp');
