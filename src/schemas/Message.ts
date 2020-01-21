import mongoose, { Document, Schema } from 'mongoose';

type Message = Document & {
  subject: string;
  body: string;
  completedAt: Date;
  tags: string[];
};

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
    completedAt: {
      type: Date,
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

export default mongoose.model<Message>('Message', MessageSchema);
