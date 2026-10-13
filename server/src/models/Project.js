import mongoose from "mongoose";

export const PROJECT_STATUSES = ["Planning", "Active", "Completed"];

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      required: true
    },
    project_lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

projectSchema.index({ project_lead_id: 1 });

export default mongoose.model("Project", projectSchema);
