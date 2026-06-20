import mongoose, { Schema, Document } from "mongoose";

export interface ISite extends Document {
  name: string;
  description: string;
}

const siteSchema = new Schema<ISite>(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISite>("Site", siteSchema);