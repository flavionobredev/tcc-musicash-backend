import { SongSource } from './song-source.vo';

describe('SongSource', () => {
  it('should be created with a provider and providerId', () => {
    const provider = 'provider';
    const providerId = 'provider-id';
    const songSource = new SongSource(provider, providerId);
    expect(songSource.provider).toBe(provider);
    expect(songSource.providerSongId).toBe(providerId);
  });

  it('should throw an error if the provider is invalid', () => {
    expect(() => new SongSource('', 'provider-id')).toThrow('Invalid provider');
  });

  it('should throw an error if the providerId is invalid', () => {
    expect(() => new SongSource('provider', '')).toThrow('Invalid providerId');
  });
});
