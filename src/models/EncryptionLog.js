import mongoose from 'mongoose';

const encryptionLogSchema = new mongoose.Schema({
    originalText: {
        type: String,
        required: true,
    },
    algorithm: {
        type: String,
        required: true,
        enum: ['caesar', 'vigenere'],
    },
    action: {
        type: String,
        required: true,
        enum: ['encrypt', 'decrypt'],
        default: 'encrypt'
    },
    key: {
        type: mongoose.Schema.Types.Mixed, // Can be Number (Caesar) or String (Vigenere)
        required: true,
    },
    encryptedText: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const EncryptionLog = mongoose.model('EncryptionLog', encryptionLogSchema);

export default EncryptionLog;
