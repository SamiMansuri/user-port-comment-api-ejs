const { Schema, default: mongoose } = require("mongoose");

const commentsSchema = Schema({
  commentBy: { type: Schema.Types.ObjectId, ref: "userModel" },
  commentOn: { type: Schema.Types.ObjectId, ref: "postModel" },
  comment: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

exports.commentModel = mongoose.model("commentModel", commentsSchema);
