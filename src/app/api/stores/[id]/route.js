import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Store from '@/lib/models/Store';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const store = await Store.findById(id).lean();
    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: store });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}
