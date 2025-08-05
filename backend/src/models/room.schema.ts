import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String
  }],
  area: {
    type: Number,
    required: true,
    min: 1,
    max: 10000 // максимальная площадь в м²
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  fullDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  views: {
    type: Number,
    default: 0
  },
  contactViews: {
    type: Number,
    default: 0
  },
  // Ссылка на пользователя, который создал помещение
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Дополнительные полезные поля
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false // убираем поле __v
});

// Обновляем updatedAt при изменении документа
roomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

roomSchema.methods.incrementViews = async function() {
  this.views += 1
};

roomSchema.methods.incrementContactViews = async function() {
  this.contactViews += 1
};

const RoomModel = mongoose.model('Room', roomSchema);

export default RoomModel