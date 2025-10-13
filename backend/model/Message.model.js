import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // fileUrl
    // fileSize
    // Optionally: attachments, reactions, etc.
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
