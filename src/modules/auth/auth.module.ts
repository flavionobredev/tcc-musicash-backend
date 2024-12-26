import { Global, Module } from '@nestjs/common';
import { FirebaseApp, makeFirebaseApp } from 'src/main/config/firebase';

@Global()
@Module({
  // imports: [AppLoginGoogleUsecaseModule],
  // controllers: [GoogleAuthController],
  providers: [
    // {
    //   provide: TokenService,
    //   useFactory: () =>
    //     new JWTTokenService({ secret: process.env.APP_JWT_SECRET }),
    // },
    {
      provide: FirebaseApp,
      useFactory: () => {
        return makeFirebaseApp();
      },
    },
  ],
  exports: [/*TokenService*/ FirebaseApp],
})
export class AuthModule {}
