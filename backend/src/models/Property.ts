import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import slugify from 'slugify';

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    width: Number,
    height: Number,
    alt: String,
  },
  { _id: false }
);

const AgentSchema = new Schema(
  {
    name: String,
    phone: String,
    whatsapp: String,
    email: String,
    avatar: String,
    licenseNo: String,
  },
  { _id: false }
);

const PropertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, index: true },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
    description: { type: String, required: true },

    location: { type: String, required: true, index: true },
    community: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },

    price: { type: Number, required: true, index: true },
    currency: { type: String, enum: ['AED', 'USD'], default: 'AED' },
    pricePerSqft: Number,
    paymentPlan: String,

    category: {
      type: String,
      enum: ['apartment', 'penthouse', 'villa', 'townhouse', 'commercial', 'plot'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ready', 'off-plan', 'resale', 'rental'],
      required: true,
      index: true,
    },

    bedrooms: { type: Number, default: 0, index: true },
    bathrooms: { type: Number, default: 0, index: true },
    areaSqft: Number,
    areaSqm: Number,
    parking: Number,
    yearBuilt: Number,
    developer: String,
    handover: String,

    amenities: [String],
    cover: { type: String, required: true },
    gallery: [MediaSchema],
    videos: [MediaSchema],
    floorPlans: [MediaSchema],
    virtualTourUrl: String,
    brochureUrl: String,

    agent: AgentSchema,

    featured: { type: Boolean, default: false, index: true },
    trending: { type: Boolean, default: false, index: true },
    newLaunch: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },

    investmentScore: { type: Number, min: 0, max: 100 },
    roiAnnualPercent: Number,
    nearby: [
      {
        type: { type: String, enum: ['school', 'hospital', 'mall', 'metro', 'beach', 'airport', 'other'] },
        name: String,
        distanceKm: Number,
      },
    ],

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// indexes
PropertySchema.index({ price: 1, category: 1, status: 1 });
PropertySchema.index({ location: 'text', title: 'text', description: 'text' });

// auto-slug on create / title change
PropertySchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export type PropertyDoc = HydratedDocument<InferSchemaType<typeof PropertySchema>>;
export const PropertyModel = model('Property', PropertySchema);
