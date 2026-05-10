import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

// Simple contact inquiry stored in DB (you can add a Contact model later)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // For now, log the inquiry (add email service / Contact model as needed)
    console.log('Contact Inquiry:', { name, email, phone, message, timestamp: new Date() });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. We will contact you shortly.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry.' },
      { status: 500 }
    );
  }
}
