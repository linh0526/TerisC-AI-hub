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

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { toolId, reviewId } = await request.json();

    if (!toolId || !reviewId) {
      return NextResponse.json({ error: 'Missing toolId or reviewId' }, { status: 400 });
    }

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Filter out the review to be deleted
    const initialCount = tool.reviews.length;
    tool.reviews = tool.reviews.filter((r: any) => r._id.toString() !== reviewId);

    if (tool.reviews.length === initialCount) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Recalculate average rating
    if (tool.reviews.length > 0) {
      const totalRating = tool.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
      tool.rating = totalRating / tool.reviews.length;
    } else {
      tool.rating = 0;
    }
    tool.reviewCount = tool.reviews.length;

    await tool.save();

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
