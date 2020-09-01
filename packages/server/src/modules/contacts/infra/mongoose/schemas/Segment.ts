import mongoose, { Document, Schema, Model } from 'mongoose';

export type SegmentDocument = Document & {
  title: string;
  tags: string[];
};

type SegmentModel = Model<SegmentDocument>;

const SegmentSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<SegmentDocument, SegmentModel>(
  'Segment',
  SegmentSchema,
);
