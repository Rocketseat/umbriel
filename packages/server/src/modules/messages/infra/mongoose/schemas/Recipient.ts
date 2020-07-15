import mongoose, { Document, Schema, Model } from 'mongoose';

type MessageEvent = {
  type: string;
  eventAt: Date;
  data: object;
};

export type RecipientAttributes = {
  recipientEmail: string;
  contact: string;
  message: string;
  events?: MessageEvent[];
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
        type: {
          type: String,
          required: true,
          enum: ['deliver', 'open', 'click', 'bounce', 'complaint', 'reject'],
        },
        eventAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        data: Schema.Types.Mixed,
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
