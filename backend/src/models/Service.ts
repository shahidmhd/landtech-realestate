import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import slugify from 'slugify';

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    icon: String,
    excerpt: String,
    content: String,
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

ServiceSchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export type ServiceDoc = HydratedDocument<InferSchemaType<typeof ServiceSchema>>;
export const ServiceModel = model('Service', ServiceSchema);
