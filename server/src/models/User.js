import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    f_name: {
      type: String,
      required: true,
      trim: true
    },
    l_name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
