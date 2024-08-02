export class SongSource {
  readonly provider: string;
  readonly providerId: string;

  constructor(provider: string, providerId: string) {
    if (!provider) {
      throw new Error('Invalid provider');
    }

    if (!providerId) {
      throw new Error('Invalid providerId');
    }
    
    this.provider = provider;
    this.providerId = providerId;
  }
}
