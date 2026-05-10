import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const product = await Product.findById(id)
      .populate('store_id', 'name phone whatsapp googleMapsUrl address license_info hours')
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch related products (same category, excluding this one)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();

    return NextResponse.json({ success: true, data: product, related });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
