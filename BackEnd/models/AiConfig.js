import mongoose from "mongoose";

const aiConfigSchema = new mongoose.Schema(
  {
    profileType: { 
      type: String, 
      required: true, 
      unique: true,
      enum: ["software", "fresher", "marketing", "management", "default"]
    },
    weights: {
      keywordMatch: { type: Number, required: true, default: 30 },
      skillsTaxonomy: { type: Number, required: true, default: 35 },
      experienceDuration: { type: Number, required: true, default: 20 },
      educationFormatting: { type: Number, required: true, default: 15 }
    },
    minimumPassingScore: { type: Number, required: true, default: 60 }
  },
  { timestamps: true }
);

export default mongoose.model("AiConfig", aiConfigSchema);