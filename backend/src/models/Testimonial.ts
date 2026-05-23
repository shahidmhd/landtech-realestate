import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    role: String,
    avatar: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    videoUrl: String,
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type TestimonialDoc = HydratedDocument<InferSchemaType<typeof TestimonialSchema>>;
export const TestimonialModel = model('Testimonial', TestimonialSchema);
