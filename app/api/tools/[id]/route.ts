import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tool from '@/models/Tool';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updatedTool = await Tool.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTool);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedTool = await Tool.findByIdAndDelete(id);
    if (!deletedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
  }
}
