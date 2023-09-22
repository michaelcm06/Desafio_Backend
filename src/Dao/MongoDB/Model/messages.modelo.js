import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  emisor: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
