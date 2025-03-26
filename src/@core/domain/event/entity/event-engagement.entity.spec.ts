import { makeId } from 'test/@shared/generators/id.generator';
import { EventEngagement } from './event-engagement.entity';

describe('EventEngagementEntity unit test', () => {
  describe('create method', () => {
    it('should be possible to create an instance of EventEngagement', () => {
      const eventEngagement = EventEngagement.create({
        userId: makeId(),
        eventId: makeId(),
        role: EventEngagement.Roles.MEMBER,
      });

      expect(eventEngagement).toBeDefined();
    });
    it('should throw an error if some required field is missing', () => {
      expect(() =>
        EventEngagement.create({
          userId: '',
          eventId: makeId(),
          role: EventEngagement.Roles.MEMBER,
        }),
      ).toThrow('Invalid userId');

      expect(() =>
        EventEngagement.create({
          userId: makeId(),
          eventId: '',
          role: EventEngagement.Roles.MEMBER,
        }),
      ).toThrow('Invalid eventId');

      expect(() =>
        EventEngagement.create({
          userId: makeId(),
          eventId: makeId(),
          role: 'invalid-role' as EventEngagement.Roles,
        }),
      ).toThrow('Invalid role');
    });
  });

  describe('restore method', () => {
    it('should be possible to restore an instance of EventEngagement', () => {
      const eventEngagement = EventEngagement.restore({
        userId: makeId(),
        eventId: makeId(),
        role: EventEngagement.Roles.MEMBER,
        status: EventEngagement.Status.ACTIVE,
      });

      expect(eventEngagement).toBeDefined();
    });
    it('should throw an error if some required field is missing', () => {
      expect(() =>
        EventEngagement.restore({
          userId: '',
          eventId: makeId(),
          role: EventEngagement.Roles.MEMBER,
          status: EventEngagement.Status.ACTIVE,
        }),
      ).toThrow('Invalid userId');

      expect(() =>
        EventEngagement.restore({
          userId: makeId(),
          eventId: '',
          role: EventEngagement.Roles.MEMBER,
          status: EventEngagement.Status.ACTIVE,
        }),
      ).toThrow('Invalid eventId');
      expect(() =>
        EventEngagement.restore({
          userId: makeId(),
          eventId: makeId(),
          role: 'invalid-role' as EventEngagement.Roles,
          status: EventEngagement.Status.ACTIVE,
        }),
      ).toThrow('Invalid role');

      expect(() =>
        EventEngagement.restore({
          userId: makeId(),
          eventId: makeId(),
          role: EventEngagement.Roles.MEMBER,
          status: 'invalid-status' as EventEngagement.Status,
        }),
      ).toThrow('Invalid status');
    });
  });

  describe('toJSON method', () => {
    it('should return a JSON representation of the EventEngagement instance', () => {
      const eventEngagement = EventEngagement.create({
        userId: makeId(),
        eventId: makeId(),
        role: EventEngagement.Roles.MEMBER,
      });

      const json = eventEngagement.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('userId');
      expect(json).toHaveProperty('eventId');
      expect(json).toHaveProperty('role');
      expect(json).toHaveProperty('status');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });
});
