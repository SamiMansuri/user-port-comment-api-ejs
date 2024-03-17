const { Schema, default: mongoose } = require("mongoose");

const passwordReset = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

passwordReset.index({ updatedAt: 1 }, { expireAfterSeconds: 300 });

exports.passwordReset = mongoose.model("passwordReset", passwordReset);
