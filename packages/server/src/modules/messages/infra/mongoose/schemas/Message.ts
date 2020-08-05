import mongoose, { Document, Schema, Model } from 'mongoose';

export type MessageAttributes = {
  subject: string;
  body: string;
  finalBody: string;
  recipientsCount?: number;
  sentCount?: number;
  sentAt?: Date;
  template?: string;
  sender: {
    name: string;
    email: string;
  };
  tags: string[];
};

export type MessageDocument = Document & MessageAttributes;

type MessageModel = Model<MessageDocument>;

const MessageSchema = new Schema(
  {
    subject: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    finalBody: {
      type: String,
      required: true,
    },
    recipientsCount: {
      type: Number,
      default: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    sender: {
      name: String,
      email: String,
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

export default mongoose.model<MessageDocument, MessageModel>(
  'Message',
  MessageSchema,
);
