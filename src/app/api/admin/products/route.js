import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { promises as fs } from 'fs';
import path from 'path';

// GET — list all products (including unavailable) for admin
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — create a new product (admin only)
export async function POST(request) {
  try {
    await dbConnect();
    const contentType = request.headers.get('content-type') || '';
    
    let body = {};
    let imageUrls = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract basic fields
      body.name = formData.get('name');
      body.category = formData.get('category');
      body.subcategory = formData.get('subcategory');
      body.brand = formData.get('brand');
      body.description = formData.get('description');
      
      try {
        body.price_range = JSON.parse(formData.get('price_range') || '{}');
      } catch (e) {
        body.price_range = { min: 0, max: 0 };
      }
      
      body.tags = formData.get('tags') || '';
      body.alcoholContent = formData.get('alcoholContent') || '';
      body.volume = formData.get('volume') || '';
      body.origin = formData.get('origin') || '';
      body.featured = formData.get('featured') === 'true';
      body.available = formData.get('available') === 'true';
      
      // Extract files
      const files = formData.getAll('files');
      
      if (files.length > 6) {
        return NextResponse.json({ success: false, error: 'Maximum 6 images allowed.' }, { status: 400 });
      }

      for (const file of files) {
        if (typeof file === 'object' && file.name) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          if (buffer.length > 50 * 1024 * 1024) {
             return NextResponse.json({ success: false, error: 'File size exceeds 50MB limit.' }, { status: 400 });
          }

          const filename = Date.now() + '-' + file.name.replaceAll(' ', '-');
          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          
          await fs.mkdir(uploadDir, { recursive: true });
          const filepath = path.join(uploadDir, filename);
          
          await fs.writeFile(filepath, buffer);
          imageUrls.push(`/uploads/${filename}`);
        }
      }
      
      body.images = imageUrls;
      if (imageUrls.length > 0) {
        body.image = imageUrls[0]; // fallback for main image
      } else if (formData.get('image')) {
        body.image = formData.get('image'); // if user submitted string url
      }

    } else {
      // JSON fallback
      body = await request.json();
    }

    // Validate required fields
    if (!body.name || !body.category || !body.brand || !body.price_range || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, category, brand, price_range, description' },
        { status: 400 }
      );
    }

    if (typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
