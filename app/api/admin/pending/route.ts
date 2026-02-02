import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET() {
  try {
    await dbConnect();
    // Only fetch what's needed: unapproved tools
    const pendingTools = await Tool.find({ isApproved: false }).sort({ createdAt: -1 });
    return NextResponse.json(pendingTools);
  } catch (error) {
    console.error('Pending Tools API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch pending tools' }, { status: 500 });
  }
}
