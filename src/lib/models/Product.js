import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Whisky', 'Wine', 'Beer', 'Rum', 'Gin', 'Vodka', 'Tequila', 'Champagne', 'Brandy', 'Liqueur'],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand name'],
      trim: true,
    },
    price_range: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    image: {
      type: String,
      required: false,
    },
    images: [{ type: String }],
    alcoholContent: {
      type: String,
      default: 'N/A',
    },
    volume: {
      type: String,
      default: '750ml',
    },
    origin: {
      type: String,
      default: 'India',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
    tags: [{ type: String }],
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in Next.js hot reloads
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
