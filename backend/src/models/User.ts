import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['admin', 'editor', 'broker', 'user'],
      default: 'user',
      index: true,
    },
    phone: String,
    avatar: String,
    licenseNo: String,
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDoc = HydratedDocument<InferSchemaType<typeof UserSchema>, UserMethods>;
export const UserModel = model<InferSchemaType<typeof UserSchema>, never, UserMethods>('User', UserSchema);
