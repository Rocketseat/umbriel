import mongoose, { Document, Schema, Model } from 'mongoose';

export type TemplateAttributes = {
  title: string;
  content: string;
};

export type TemplateDocument = Document & TemplateAttributes;

type TemplateModel = Model<TemplateDocument>;

const TemplateSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<TemplateDocument, TemplateModel>(
  'Template',
  TemplateSchema,
);
