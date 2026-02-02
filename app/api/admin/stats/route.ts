import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function GET() {
  try {
    await dbConnect();
    
    // Efficiently get counts using countDocuments
    const totalTools = await Tool.countDocuments();
    const pendingToolsCount = await Tool.countDocuments({ isApproved: false });
    
    // Count total reviews across all tools
    const reviewStats = await Tool.aggregate([
      { $unwind: "$reviews" },
      { $count: "totalReviews" }
    ]);
    const totalReviews = reviewStats[0]?.totalReviews || 0;

    return NextResponse.json({
      totalTools,
      pendingToolsCount,
      totalReviews
    });
  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
