import { InferSchemaType, Schema } from 'mongoose';
import { MongoModelsName } from '../models.enum';
import { EventEngagement } from 'src/@core/domain/event/entity/event-engagement.entity';

export const EventEngagementSchema = new Schema(
  {
    _id: Schema.ObjectId,
    event_id: {
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.Events,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.Users,
      required: true,
    },
    role: {
      type: String,
      enum: EventEngagement.Roles,
      required: true,
    },
    status: {
      type: String,
      enum: EventEngagement.Status,
      default: EventEngagement.Status.ACTIVE,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export type EventEngagementSchemaType = InferSchemaType<
  typeof EventEngagementSchema
>;
