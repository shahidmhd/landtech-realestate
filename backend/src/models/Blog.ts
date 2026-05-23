import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import slugify from 'slugify';

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    author: {
      name: String,
      avatar: String,
      bio: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
    published: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: () => new Date(), index: true },
    readMinutes: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogSchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export type BlogDoc = HydratedDocument<InferSchemaType<typeof BlogSchema>>;
export const BlogModel = model('Blog', BlogSchema);
