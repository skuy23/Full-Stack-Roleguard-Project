const { Schema, model } = require('mongoose');
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER','MANAGER','ADMIN'], default: 'USER' },
  tokenVersion: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = model('User', userSchema);
