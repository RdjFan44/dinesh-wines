import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

// PATCH — toggle product availability
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Toggle the available field
    product.available = !product.available;
    await product.save();

    return NextResponse.json({
      success: true,
      data: { _id: product._id, available: product.available },
      message: `Product marked as ${product.available ? 'available' : 'unavailable'}`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
