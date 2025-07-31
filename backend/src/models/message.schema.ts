import mongoose, { Schema } from "mongoose";
import chatSchema from "./chat.schema";

const messageSchema = new Schema({
  // Ссылка на чат
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  // Отправитель сообщения
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Текст сообщения
  text: {
    type: String,
    trim: true,
    maxlength: 2000
  },

  isRead: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

// Индексы
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ isRead: 1 });

// Middleware для обновления lastMessage в чате
messageSchema.post('save', async function(doc) {
  await chatSchema.findByIdAndUpdate(doc.chat, {
    lastMessage: doc._id
  });
});

export default mongoose.model('Message', messageSchema);