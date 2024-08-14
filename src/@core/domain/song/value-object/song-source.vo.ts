export class SongSource {
  readonly provider: string;
  readonly providerSongId: string;

  constructor(provider: string, providerSongId: string) {
    if (!provider) {
      throw new Error('Invalid provider');
    }

    if (!providerSongId) {
      throw new Error('Invalid providerId');
    }

    this.provider = provider;
    this.providerSongId = providerSongId;
  }
}
