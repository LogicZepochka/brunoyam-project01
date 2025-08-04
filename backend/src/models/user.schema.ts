
import mongoose, { Schema } from "mongoose";
import * as argon2 from "argon2";
import { userRoles } from "../repositories/types";



const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+7\d{10}$/, 'Номер должен начинаться с +7 и содержать 10 цифр после']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Пожалуйста, введите корректный email']
  },
  lastLogin: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: Object.values(userRoles),
    default: userRoles.USER,
    required: true
  }
}, {
  timestamps: true
});

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return argon2.verify(this.password, candidatePassword);
};

const UserModel = mongoose.model('User', UserSchema)

export default UserModel