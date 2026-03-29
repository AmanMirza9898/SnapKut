import mongoose, { Schema, model, models } from "mongoose";

const SocialShortcutSchema = new Schema(
  {
    platform: { 
      type: String, 
      required: true, 
      enum: ["Instagram", "Telegram", "WhatsApp", "Facebook", "Twitter", "LinkedIn", "Other"] 
    },
    username: { type: String, required: true },
    deepLink: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const SocialShortcut = models.SocialShortcut || model("SocialShortcut", SocialShortcutSchema);
export default SocialShortcut;
