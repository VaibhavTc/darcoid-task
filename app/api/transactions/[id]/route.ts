import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Transaction } from '@/lib/models/transaction';

// PUT /api/transactions/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const updated = await Transaction.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json({
      id: updated._id.toString(),
      description: updated.description,
      amount: updated.amount,
      date: updated.date,
      categoryId: updated.categoryId?.toString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Transaction.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
