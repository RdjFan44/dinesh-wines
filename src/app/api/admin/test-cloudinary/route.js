import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// GET /api/admin/test-cloudinary
// Temporary diagnostic route — verifies Cloudinary env vars are loaded correctly
export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Show partial values so we can verify without exposing full secrets
  const info = {
    CLOUDINARY_CLOUD_NAME: cloudName ? `"${cloudName}" (${cloudName.length} chars)` : '❌ MISSING',
    CLOUDINARY_API_KEY: apiKey ? `"${apiKey.slice(0, 4)}..." (${apiKey.length} chars)` : '❌ MISSING',
    CLOUDINARY_API_SECRET: apiSecret ? `"${apiSecret.slice(0, 4)}..." (${apiSecret.length} chars)` : '❌ MISSING',
  };

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ success: false, error: 'One or more Cloudinary env vars are missing', info });
  }

  // Try a lightweight Cloudinary API call (ping the account)
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  try {
    const result = await cloudinary.api.ping();
    return NextResponse.json({ success: true, message: 'Cloudinary credentials are valid ✅', ping: result, info });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message, info }, { status: 401 });
  }
}
