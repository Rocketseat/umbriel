import mongoose, { Document, Schema, Model } from 'mongoose';

export type SenderAttributes = {
  name: string;
  email: string;
};

export type SenderDocument = Document & SenderAttributes;

type SenderModel = Model<SenderDocument>;

const SenderSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<SenderDocument, SenderModel>(
  'Sender',
  SenderSchema,
);
