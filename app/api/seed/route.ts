import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Category } from '@/lib/models/category';

const initialCategories = [
  { name: "Groceries", color: "hsl(12, 76%, 61%)", budget: 500 },
  { name: "Utilities", color: "hsl(173, 58%, 39%)", budget: 300 },
  { name: "Entertainment", color: "hsl(197, 37%, 24%)", budget: 200 },
  { name: "Transport", color: "hsl(43, 74%, 66%)", budget: 150 },
  { name: "Other", color: "hsl(27, 87%, 67%)", budget: 250 },
];

export async function GET() {
  try {
    await connectDB();
    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
      await Category.insertMany(initialCategories);
      console.log("Categories seeded successfully");
      return NextResponse.json({ message: 'Categories seeded successfully' });
    }
    
    return NextResponse.json({ message: 'Categories already exist' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed categories' }, { status: 500 });
  }
}