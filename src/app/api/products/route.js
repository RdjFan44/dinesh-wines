import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'createdAt';

    const query = { available: { $ne: false } }; // never show unavailable products publicly


    if (category && category !== 'All') {
      query.category = category;
    }
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query['price_range.min'] = {};
      if (minPrice) query['price_range.min'].$gte = parseInt(minPrice);
      if (maxPrice) query['price_range.max'] = { $lte: parseInt(maxPrice) };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const sortMap = {
      'name-asc': { name: 1 },
      'name-desc': { name: -1 },
      'price-asc': { 'price_range.min': 1 },
      'price-desc': { 'price_range.min': -1 },
      createdAt: { createdAt: -1 },
    };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('store_id', 'name phone whatsapp googleMapsUrl address')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
