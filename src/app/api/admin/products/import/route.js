import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

const VALID_CATEGORIES = ['Whisky', 'Wine', 'Beer', 'Rum', 'Gin', 'Vodka', 'Tequila', 'Champagne', 'Brandy', 'Liqueur'];

// Map a raw row object (from Excel/JSON) to a Product document
function mapRowToProduct(row, rowIndex) {
  const errors = [];

  const name = String(row.name || '').trim();
  const category = String(row.category || '').trim();
  const subcategory = String(row.subcategory || '').trim();
  const brand = String(row.brand || '').trim();
  const description = String(row.description || '').trim();
  const priceMin = parseFloat(row.price_min);
  const priceMax = row.price_max !== '' && row.price_max !== null && row.price_max !== undefined
    ? parseFloat(row.price_max)
    : priceMin;
  const alcoholContent = String(row.alcoholContent || row.alcohol_content || '').trim();
  const volume = String(row.volume || '').trim();
  const origin = String(row.origin || '').trim();
  const imageUrl = String(row.image || '').trim();
  const featured = String(row.featured || 'false').toLowerCase() === 'true';
  const available = row.available !== undefined && row.available !== null && row.available !== ''
    ? String(row.available).toLowerCase() !== 'false'
    : true;
  const tagsRaw = String(row.tags || '').trim();
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];

  // Validations
  if (!name) errors.push('name is required');
  if (!category) errors.push('category is required');
  else if (!VALID_CATEGORIES.includes(category)) errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  if (!brand) errors.push('brand is required');
  if (!description) errors.push('description is required');
  if (isNaN(priceMin) || priceMin < 0) errors.push('price_min must be a valid non-negative number');
  if (!isNaN(priceMax) && priceMax < priceMin) errors.push('price_max must be >= price_min');

  if (errors.length > 0) {
    return { valid: false, rowIndex, name: name || `Row ${rowIndex}`, errors };
  }

  return {
    valid: true,
    rowIndex,
    product: {
      name,
      category,
      subcategory: subcategory || undefined,
      brand,
      description,
      price_range: { min: priceMin, max: isNaN(priceMax) ? priceMin : priceMax },
      alcoholContent: alcoholContent || 'N/A',
      volume: volume || '750ml',
      origin: origin || 'India',
      image: imageUrl || undefined,
      images: imageUrl ? [imageUrl] : [],
      featured,
      available,
      tags,
    },
  };
}

// POST — bulk import products from Excel/CSV or JSON
export async function POST(request) {
  try {
    await dbConnect();
    const contentType = request.headers.get('content-type') || '';

    let rows = [];

    if (contentType.includes('multipart/form-data')) {
      // Handle Excel / CSV file upload
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || typeof file !== 'object') {
        return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON with headers as keys
      rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (rows.length === 0) {
        return NextResponse.json({ success: false, error: 'The file appears to be empty or has no data rows.' }, { status: 400 });
      }

    } else {
      // Handle JSON body
      const body = await request.json();
      if (!Array.isArray(body)) {
        return NextResponse.json({ success: false, error: 'JSON body must be an array of product objects.' }, { status: 400 });
      }
      rows = body;
    }

    // Map and validate each row
    const results = rows.map((row, idx) => mapRowToProduct(row, idx + 2)); // +2 for 1-indexed + header row

    const validItems = results.filter((r) => r.valid);
    const invalidItems = results.filter((r) => !r.valid);

    let inserted = 0;
    const insertErrors = [];

    if (validItems.length > 0) {
      const productsToInsert = validItems.map((r) => r.product);
      try {
        const insertResult = await Product.insertMany(productsToInsert, { ordered: false });
        inserted = insertResult.length;
      } catch (insertError) {
        // insertMany with ordered: false partially inserts — capture what failed
        if (insertError.writeErrors) {
          inserted = validItems.length - insertError.writeErrors.length;
          insertError.writeErrors.forEach((we) => {
            insertErrors.push({
              rowIndex: validItems[we.index]?.rowIndex,
              name: validItems[we.index]?.product?.name,
              errors: [we.errmsg || we.err?.errmsg || 'Database insert error'],
            });
          });
        } else {
          throw insertError;
        }
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped: 0,
      validCount: validItems.length,
      invalidCount: invalidItems.length,
      errors: [...invalidItems.map((r) => ({ rowIndex: r.rowIndex, name: r.name, errors: r.errors })), ...insertErrors],
      total: rows.length,
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET — download CSV template
export async function GET() {
  const headers = [
    'name', 'category', 'subcategory', 'brand', 'description',
    'price_min', 'price_max', 'alcoholContent', 'volume', 'origin',
    'image', 'tags', 'featured', 'available',
  ];

  const exampleRow = [
    'Glenfiddich 12 Year',
    'Whisky',
    'Single Malt',
    'Glenfiddich',
    'A classic single malt Scotch whisky with fruity and malty notes.',
    '3500',
    '4000',
    '40%',
    '750ml',
    'Scotland',
    'https://example.com/glenfiddich.jpg',
    'scotch, single malt, premium',
    'false',
    'true',
  ];

  const csvRows = [
    headers.join(','),
    exampleRow.map((v) => `"${v}"`).join(','),
  ];

  const csvContent = csvRows.join('\r\n');

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="dinesh-wines-import-template.csv"',
    },
  });
}
