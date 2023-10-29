import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Not Specified"],
      default: "Not Specified",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    profilePic: { secure_url: String, public_id: String },
    CoverPic: { secure_url: String, public_id: String },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
