export abstract class FirebaseAuth {
  abstract verifyIdToken(
    token: string,
  ): Promise<FirebaseAuth.VerifyIdTokenResult>;
}

export namespace FirebaseAuth {
  export type VerifyIdTokenResult = {
    email: string;
    name: string;
    picture: string;
  };
}
