import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a store name'],
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    whatsapp: {
      type: String,
      required: [true, 'Please provide a WhatsApp number'],
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    googleMapsUrl: {
      type: String,
    },
    googleMapsEmbed: {
      type: String,
    },
    license_info: {
      type: String,
      default: '[REPLACE_ME — Store License Number]',
    },
    hours: {
      weekdays: { type: String, default: '10:00 AM – 10:00 PM' },
      weekends: { type: String, default: '10:00 AM – 11:00 PM' },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Store || mongoose.model('Store', StoreSchema);
