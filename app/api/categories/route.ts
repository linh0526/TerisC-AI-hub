import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Tool.distinct('category');
    // Ensure defaults are there even if DB is empty
    const defaults = ['Chatbot', 'Hình ảnh', 'Lập trình', 'Video', 'Âm nhạc', 'Năng suất', 'Thiết kế'];
    const uniqueCategories = Array.from(new Set([...defaults, ...categories]));
    
    return NextResponse.json(uniqueCategories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
