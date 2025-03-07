import { InferSchemaType, Schema } from 'mongoose';
import { MongoModelsName } from '../models.enum';

export const EventMomentSchema = new Schema({
  _id: Schema.ObjectId,
  title: String,
  description: String,
  start_date: Date,
  end_date: Date,
  event: { type: Schema.Types.ObjectId, ref: MongoModelsName.Events },
  repertoire: { type: Schema.Types.ObjectId, ref: MongoModelsName.Repertoires },
  members: [
    {
      user: { type: Schema.Types.ObjectId, ref: MongoModelsName.Users },
      attributes: [String],
    },
  ],
});

export type EventMomentSchemaType = InferSchemaType<typeof EventMomentSchema>;
