import mongoose, { Document, Schema, Model } from 'mongoose';

export type ContactDocument = Document & {
  email: string;
  subscribed: boolean;
  tags: string[];
};

type ContactModel = Model<ContactDocument> & {
  findByTags(tags: string[], additional?: object): Promise<ContactDocument[]>;
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
    subscribed: {
      type: Boolean,
      default: true,
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

ContactSchema.statics.findByTags = function findByTags(
  tags: string[],
  additional?: object,
): Promise<ContactDocument[]> {
  return this.find({
    tags: {
      $in: tags,
    },
    ...additional,
  });
};

export default mongoose.model<ContactDocument, ContactModel>(
  'Contact',
  ContactSchema,
);
