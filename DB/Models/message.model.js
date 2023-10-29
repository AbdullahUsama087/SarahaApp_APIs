import mongoose, { Schema } from "mongoose";

const msgSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const msgModel = mongoose.model("Message", msgSchema);

export default msgModel;
