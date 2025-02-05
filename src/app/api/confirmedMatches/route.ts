import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Retrieve all persisted confirmed matches (order items)
export async function GET() {
  try {
    const matches = await prisma.confirmedMatch.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new confirmed match record
export async function POST(request: NextRequest) {
  try {
    const { requestItem, confirmedMatch, quantity, unitPrice, total } = await request.json();
    if (!requestItem || confirmedMatch === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newMatch = await prisma.confirmedMatch.create({
      data: { requestItem, confirmedMatch, quantity, unitPrice, total },
    });
    return NextResponse.json(newMatch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing confirmed match record
export async function PUT(request: NextRequest) {
  try {
    const { id, requestItem, confirmedMatch, quantity, unitPrice, total } = await request.json();
    if (!id || !requestItem || confirmedMatch === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const updatedMatch = await prisma.confirmedMatch.update({
      where: { id },
      data: { requestItem, confirmedMatch, quantity, unitPrice, total },
    });
    return NextResponse.json(updatedMatch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a confirmed match record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await prisma.confirmedMatch.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
