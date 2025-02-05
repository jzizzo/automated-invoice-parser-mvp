import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let products: Array<Record<string, string>> = [];

// Load the products JSON file once when this module is imported
const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');
try {
  const fileData = fs.readFileSync(productsFilePath, 'utf8');
  products = JSON.parse(fileData);
  console.log(`Loaded ${products.length} products from JSON.`);
} catch (error: any) {
  console.error('Error loading products JSON:', error.message);
  products = [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('query') || '').toLowerCase();

    // Filter products based on the Description field.
    // Adjust the field name if needed.
    const results = products
      .filter((product) =>
        product.Description?.toLowerCase().includes(query)
      )
      .map((product) => ({
        match: product.Description, // Return only the description as the match
      }));

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
