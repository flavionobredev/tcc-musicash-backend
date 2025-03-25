import { InferSchemaType, Schema } from 'mongoose';
import { MongoModelsName } from '../models.enum';

export const EventMomentSchema = new Schema(
  {
    _id: Schema.ObjectId,
    event: {
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.Events,
      required: true,
    },
    title: String,
    description: String,
    start_date: Date,
    end_date: Date,
    repertoire: {
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.Repertoires,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: MongoModelsName.Users },
        attributes: [String],
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export type EventMomentSchemaType = InferSchemaType<typeof EventMomentSchema>;
