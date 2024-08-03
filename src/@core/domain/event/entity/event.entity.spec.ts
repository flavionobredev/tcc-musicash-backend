describe('EventEntity', () => {
  it('should be possible to create an instance of EventEntity', () => {
    const event = new EventEntity({
      title: 'Event Title',
      description: 'Event Description',
      ownerId: 'ownerId',
    });

    expect(event).toBeDefined();
    expect(event.title).toBe('Event Title');
  });
});
