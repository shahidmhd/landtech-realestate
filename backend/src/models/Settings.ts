import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';

/**
 * Single-document settings store — controls dynamic homepage sections,
 * contact details, social links, SEO defaults.
 */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: 'global', unique: true },

    brand: {
      name: String,
      tagline: String,
      logo: String,
      favicon: String,
    },
    contact: {
      phone: String,
      whatsapp: String,
      email: String,
      address: String,
      hours: String,
      mapUrl: String,
      mapCoords: { lat: Number, lng: Number },
    },
    social: {
      instagram: String,
      facebook: String,
      linkedin: String,
      youtube: String,
      twitter: String,
      tiktok: String,
    },
    hero: {
      videoUrl: String,
      poster: String,
      eyebrow: String,
      title: String,
      subtitle: String,
    },
    homepage: {
      sections: [
        {
          key: String,
          enabled: Boolean,
          order: Number,
          title: String,
          subtitle: String,
        },
      ],
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      ogImage: String,
      gaId: String,
      gtmId: String,
    },
    rera: {
      orn: String,
      license: String,
      brn: String,
    },
  },
  { timestamps: true }
);

export type SettingsDoc = HydratedDocument<InferSchemaType<typeof SettingsSchema>>;
export const SettingsModel = model('Settings', SettingsSchema);
