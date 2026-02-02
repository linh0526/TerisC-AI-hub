import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'List of IDs is required' }, { status: 400 });
    }

    const result = await Tool.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      message: `Đã xóa thành công ${result.deletedCount} công cụ.`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Delete many error:', error);
    return NextResponse.json({ error: 'Failed to delete tools' }, { status: 500 });
  }
}
