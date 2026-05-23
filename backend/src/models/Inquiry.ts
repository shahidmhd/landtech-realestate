import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    message: String,
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
    propertySlug: String,
    source: { type: String, enum: ['contact', 'property', 'newsletter', 'consultation'], default: 'contact', index: true },
    status: { type: String, enum: ['new', 'in-progress', 'qualified', 'lost', 'closed'], default: 'new', index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export type InquiryDoc = HydratedDocument<InferSchemaType<typeof InquirySchema>>;
export const InquiryModel = model('Inquiry', InquirySchema);
