import mongoose from "mongoose";

const projectMembershipSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

projectMembershipSchema.index({ project_id: 1, user_id: 1 }, { unique: true });
projectMembershipSchema.index({ user_id: 1 });

export default mongoose.model("ProjectMembership", projectMembershipSchema);
