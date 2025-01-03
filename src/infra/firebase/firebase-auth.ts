import { FirebaseAuth } from 'src/@core/application/protocols/firebase-auth.protocol';
import { FirebaseApp } from './protocols/firebase-app';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseAuthAPI implements FirebaseAuth {
  constructor(
    @Inject(FirebaseApp)
    private readonly app: FirebaseApp,
  ) {}

  async verifyIdToken(token: string) {
    const firebaseUser = await this.app.auth().verifyIdToken(token);

    return {
      email: firebaseUser.email,
      name: firebaseUser.name,
      picture: firebaseUser.picture,
    };
  }
}
