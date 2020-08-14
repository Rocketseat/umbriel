import mongoose, { Document, Schema, Model } from 'mongoose';

export type TagDocument = Document & {
  title: string;
};

type TagModel = Model<TagDocument>;

const TagSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    integrationId: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<TagDocument, TagModel>('Tag', TagSchema);
