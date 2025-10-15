import { Schema, model } from "mongoose";

const ConversationSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      unique: true,
    },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

// const ConversationSchema = new Schema(
//   {
//     type: { type: String, enum: ["direct", "group"], required: true },
//     members: [{ type: Schema.Types.ObjectId, ref: "User" }],
//     tenant: { type: Schema.Types.ObjectId, ref: "Tenant" }, // for group chats
//     name: String, // group name
//     description: String,
//     lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
//     // More fields: group avatar, admins, etc.
//   },
//   { timestamps: true }
// );

const ConversationModel = model("Conversation", ConversationSchema);

export default ConversationModel;
