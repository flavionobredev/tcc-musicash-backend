export abstract class GoogleOauth2API {
  abstract getAuthUrl(): string;
  abstract validateCode(gCode: string): Promise<GoogleTokenOa2Validate.Result>;
}

export namespace GoogleTokenOa2Validate {
  export type Result = {
    email: string;
    name: string;
    picture: string;
  } | null;
}
