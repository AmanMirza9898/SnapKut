import mongoose, { Schema, model, models } from "mongoose";

const SocialLinkSchema = new Schema(
  {
    platform: { 
      type: String, 
      required: true, 
      enum: ["Instagram", "WhatsApp", "Facebook", "Twitter", "LinkedIn", "Other"] 
    },
    username: { type: String, required: true },
    deepLink: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const SocialLink = models.SocialLink || model("SocialLink", SocialLinkSchema);
export default SocialLink;
