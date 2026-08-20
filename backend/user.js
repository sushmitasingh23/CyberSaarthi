const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Represents the "Business Owner" from your workflow diagram (step 01).
// Small businesses sign up here before they can add assets.
const userSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ["owner", "admin", "viewer"],
      default: "owner",
    },
    // RBAC field referenced in your "Risk Controls" slide (Sensitive Data -> Encryption + RBAC)
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving - never store plaintext passwords.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method used during login to verify credentials.
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);