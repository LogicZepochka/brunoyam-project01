import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({

  property: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: function(arr: any) {
        return arr.length === 2 && 
               new Set(arr.map((id: { toString: () => string; }) => id.toString())).size === 2;
      },
      message: 'Чат должен иметь ровно двух уникальных участников'
    }
  }],
  // Флаг, если чат заблокирован
  isBlocked: {
    type: Boolean,
    default: false
  },
  // Дата создания
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Последнее сообщение (для превью в списке чатов)
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  versionKey: false
});

// Индексы для быстрого поиска
chatSchema.index({ participants: 1 });
chatSchema.index({ property: 1 });
chatSchema.index({ lastMessage: 1 });

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;