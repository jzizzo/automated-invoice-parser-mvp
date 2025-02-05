import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retrieve all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new order with its order items
export async function POST(request: NextRequest) {
  try {
    const { orderItems, requestUrl, responseUrl } = await request.json();
    if (!orderItems || !Array.isArray(orderItems)) {
      return NextResponse.json(
        { error: "Order items are required" },
        { status: 400 }
      );
    }
    const newOrder = await prisma.order.create({
      data: {
        requestUrl: requestUrl || "",
        responseUrl: responseUrl || "",
        orderItems: orderItems,
      },
    });
    return NextResponse.json(newOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
