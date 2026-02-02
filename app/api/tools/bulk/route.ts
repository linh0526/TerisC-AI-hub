import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Data must be an array' }, { status: 400 });
    }

    // 1. Get all existing links to check duplicates
    const existingTools = await Tool.find({}, 'link');
    const existingLinks = new Set(existingTools.map(t => t.link));

    // 2. Filter out duplicates from the incoming request
    const uniqueBody = body.filter((item: any, index: number, self: any[]) => 
      // Keep only first occurrence in the bulk list
      index === self.findIndex((t) => t.link === item.link) && 
      // And must not already exist in DB
      !existingLinks.has(item.link)
    );

    const skippedCount = body.length - uniqueBody.length;

    if (uniqueBody.length === 0) {
      return NextResponse.json({ 
        message: 'Tất cả công cụ này đã tồn tại trong thư viện. Không có gì được thêm mới.',
        insertedCount: 0,
        skippedCount
      }, { status: 200 });
    }

    const toolsToInsert = uniqueBody.map((tool: any) => ({
      ...tool,
      isApproved: true
    }));

    const tools = await Tool.insertMany(toolsToInsert, { ordered: false });
    
    return NextResponse.json({
      message: skippedCount > 0 
        ? `Đã thêm ${tools.length} công cụ mới thành công. (Bỏ qua ${skippedCount} bản trùng lặp)`
        : `Đã thêm thành công tất cả ${tools.length} công cụ!`,
      insertedCount: tools.length,
      skippedCount
    }, { status: 201 });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi nhập hàng loạt' }, { status: 500 });
  }
}
