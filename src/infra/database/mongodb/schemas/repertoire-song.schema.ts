import { InferSchemaType, Schema } from 'mongoose';
import { MongoModelsName } from '../models.enum';

export const RepertoireSongSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    repertoire: {
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.Repertoires,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lyrics: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    youtube_link: {
      type: String,
    },
    song: {
      type: Schema.Types.ObjectId,
      ref: MongoModelsName.Songs,
    },
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

export type RepertoireSongSchemaType = InferSchemaType<
  typeof RepertoireSongSchema
>;
