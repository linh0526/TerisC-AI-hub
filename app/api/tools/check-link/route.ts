import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const link = searchParams.get('link');

    if (!link) {
       return NextResponse.json({ error: 'Link is required' }, { status: 400 });
    }

    const exists = await Tool.findOne({ link });
    return NextResponse.json({ exists: !!exists, name: exists?.name });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check link' }, { status: 500 });
  }
}
