import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Use aggregation to flatten reviews across all tools
    const reviews = await Tool.aggregate([
      { $unwind: "$reviews" },
      { $sort: { "reviews.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: "$reviews._id",
          userName: "$reviews.user",
          comment: "$reviews.comment",
          rating: "$reviews.rating",
          createdAt: "$reviews.createdAt",
          toolId: "$_id",
          toolName: "$name"
        }
      }
    ]);

    const totalStats = await Tool.aggregate([
      { $unwind: "$reviews" },
      { $count: "count" }
    ]);
    const total = totalStats[0]?.count || 0;

    return NextResponse.json({
      reviews,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('All Reviews API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
