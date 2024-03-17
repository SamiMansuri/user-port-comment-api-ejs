const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  let password = update.password;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    update.password = hashedPassword;
  }
  const fieldsToRemove = [];
  for (let field in update) {
    if (update[field] === "") {
      fieldsToRemove.push(field);
      delete update[field];
    }
  }
  this.updateMany({}, { $unset: fieldsToRemove });
  next();
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

exports.userModel = mongoose.model("userModel", userSchema);
