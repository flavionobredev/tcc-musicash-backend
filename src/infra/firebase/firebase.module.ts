import { Global, Module, OnModuleInit } from '@nestjs/common';
import admin from 'firebase-admin';
import { FirebaseAuth } from 'src/@core/application/protocols/firebase-auth.protocol';
import { FirebaseAuthAPI } from './firebase-auth';
import { FirebaseApp } from './protocols/firebase-app';

@Global()
@Module({
  providers: [
    {
      provide: FirebaseAuth,
      useClass: FirebaseAuthAPI,
    },
    {
      provide: FirebaseApp,
      useFactory: () => {
        return admin.initializeApp();
      },
    },
  ],
  exports: [FirebaseAuth],
})
export class FirebaseModule {}
