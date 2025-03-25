import { InferSchemaType, Schema } from 'mongoose';
import { MongoModelsName } from '../models.enum';
import { EventMomentSchema } from './event-moments.schema';

export const EventSchema = new Schema(
  {
    title: String,
    description: String,
    start_date: Date,
    end_date: Date,
    type: String,
    owner: { type: Schema.Types.ObjectId, ref: MongoModelsName.Users },
    // moments: [EventMomentSchema],
    moments: [{
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.EventMoments,
    }],
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export type EventSchemaType = InferSchemaType<typeof EventSchema>;
