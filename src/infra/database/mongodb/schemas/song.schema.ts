import { InferSchemaType, Schema } from 'mongoose';

export const SongSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artists: {
      type: [String],
      required: true,
    },
    lyric_preview: {
      type: String,
      required: true,
    },
    thumbnail_link: {
      type: String,
    },
    external_provider: {
      type: String,
      required: true,
    },
    external_provider_song_id: {
      type: String,
      required: true,
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

export type SongSchemaType = InferSchemaType<typeof SongSchema>;
