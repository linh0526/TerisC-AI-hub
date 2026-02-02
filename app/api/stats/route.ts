import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Stats from '@/models/Stats';

export async function GET() {
  try {
    await dbConnect();
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({ pageViews: 0, toolClicks: 0 });
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { action } = await request.json();
    
    if (action === 'click') {
      await Stats.updateOne({}, { $inc: { toolClicks: 1 } }, { upsert: true });
    } else if (action === 'view') {
      await Stats.updateOne({}, { $inc: { pageViews: 1 } }, { upsert: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}
