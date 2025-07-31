
import mongoose, { Schema } from "mongoose";
import * as argon2 from "argon2";

const userRoles = {
  USER: 'Пользователь',
  BUSINESS: 'Предприятие',
  ADMIN: 'Администратор'
};

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



export default {
  User: mongoose.model('User', UserSchema),
  userRoles
};