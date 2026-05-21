import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'dinesh-wines' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// GET — single product for admin
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update product (admin only)
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    
    let body = {};
    let newImageUrls = [];

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
      
      // Parse existing images array sent from client
      let existingImages = [];
      if (formData.get('images')) {
        try {
          existingImages = JSON.parse(formData.get('images'));
        } catch (e) {
          existingImages = [];
        }
      }

      // Extract new files
      const files = formData.getAll('files');
      
      if (existingImages.length + files.length > 6) {
        return NextResponse.json({ success: false, error: 'Maximum 6 images allowed in total.' }, { status: 400 });
      }

      for (const file of files) {
        if (typeof file === 'object' && file.name) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          if (buffer.length > 50 * 1024 * 1024) {
             return NextResponse.json({ success: false, error: 'File size exceeds 50MB limit.' }, { status: 400 });
          }

          const secureUrl = await uploadToCloudinary(buffer);
          newImageUrls.push(secureUrl);
        }
      }
      
      body.images = [...existingImages, ...newImageUrls];
      if (body.images.length > 0) {
        body.image = body.images[0]; // fallback for main image
      } else if (formData.get('image')) {
        body.image = formData.get('image'); // if user submitted string url
      } else {
        body.image = '';
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

    // Tags: accept comma-separated string or array
    if (typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Ensure price_range numbers are parsed
    if (body.price_range) {
      body.price_range.min = Number(body.price_range.min);
      body.price_range.max = Number(body.price_range.max);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — delete product (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
