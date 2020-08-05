import mongoose, { Document, Schema, Model, Types } from 'mongoose';

type MessageEvent = {
  type: string;
  eventAt: Date;
  data: object;
};

export type RecipientAttributes = {
  recipientEmail: string;
  contact: string;
  message: string;
  events?: Types.Array<MessageEvent>;
};

export type RecipientDocument = Document & RecipientAttributes;

type RecipientModel = Model<RecipientDocument>;

const RecipientSchema = new Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    events: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<RecipientDocument, RecipientModel>(
  'Recipient',
  RecipientSchema,
);
