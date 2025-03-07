import { InferSchemaType, Schema } from 'mongoose';
import { RepertoireSongSchema } from './repertoire-song.schema';

export const RepertoireSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    songs: [RepertoireSongSchema],
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

export type RepertoireSchemaType = InferSchemaType<typeof RepertoireSchema>;
