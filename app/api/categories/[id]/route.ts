import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category } from "@/lib/models/category";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { budget } = await request.json();
    const updated = await Category.findByIdAndUpdate(
      params.id,
      { budget },
      { new: true },
    );
    return NextResponse.json({
      id: updated._id.toString(),
      name: updated.name,
      color: updated.color,
      budget: updated.budget,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category budget" },
      { status: 500 },
    );
  }
}
