import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category } from "@/lib/models/category";
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    const mappedCategories = categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      color: category.color,
      budget: category.budget,
    }));

    return NextResponse.json(mappedCategories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log("✅ Reached POST handler");

    const body = await request.json();
    console.log("✅ Parsed body:", body);

    const category = await Category.create(body);
    console.log("✅ Saved category:", category);

    return NextResponse.json(category);
  } catch (error: any) {
    console.error("❌ Error in POST:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 },
    );
  }
}
