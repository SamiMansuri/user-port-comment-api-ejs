const { Schema, default: mongoose } = require("mongoose");

const postSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "userModel" },
  title: { type: String, required: true },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

exports.postModel = mongoose.model("postModel", postSchema);
