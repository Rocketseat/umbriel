import mongoose, { Document, Schema } from 'mongoose';

type Contact = Document & {
  email: string;
  tags: string[];
};

const ContactSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
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

export default mongoose.model<Contact>('Contact', ContactSchema);
