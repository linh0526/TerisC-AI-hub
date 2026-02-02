import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { userName, rating, comment } = await request.json();
    
    const tool = await Tool.findById(params.id);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Add review to array
    const newReview = {
      user: userName,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    tool.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = tool.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
    tool.rating = totalRating / tool.reviews.length;
    tool.reviewCount = tool.reviews.length;

    await tool.save();

    return NextResponse.json({ message: 'Review added successfully', tool });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
