import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    // Base query for home page vs admin
    let query: any = all ? {} : { 
      $or: [
        { isApproved: true }, 
        { isApproved: { $exists: false } }
      ] 
    };

    // Filter by category
    if (category && category !== 'Tất cả') {
      query.category = category;
    }

    // Search by name, description or tags
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      });
    }

    const total = await Tool.countDocuments(query);
    const tools = await Tool.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      tools,
      metadata: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Strictly assign isApproved based on whether it's explicitly set to true
    const toolData = {
      ...body,
      isApproved: body.isApproved === true ? true : false
    };
    
    const tool = await Tool.create(toolData);
    return NextResponse.json(tool, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Công cụ với đường dẫn này đã tồn tại trong thư viện!' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}
