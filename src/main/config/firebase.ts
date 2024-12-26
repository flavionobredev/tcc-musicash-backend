import admin from 'firebase-admin';
export const makeFirebaseApp = () => {
  return admin.initializeApp();
};

export type FirebaseApp = ReturnType<typeof makeFirebaseApp>;
export const FirebaseApp = Symbol('FirebaseApp');
