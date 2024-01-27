import mongoose, { Schema, Document, model } from 'mongoose';

const KeySchema: Schema = new Schema({
    key: { type: String, required: true },
    admin: { type: Boolean, required: true },
    version: { type: Number, required: true },
    createdAt: { type: Date, required: false, default: Date.now() },
    lastUsed: { type: Date, required: false, default: Date.now() }
});

const KeyModel = mongoose.models.apiKeys || model('apiKeys', KeySchema);

export { KeyModel, KeySchema }