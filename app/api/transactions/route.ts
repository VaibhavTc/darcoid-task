import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Transaction } from "@/lib/models/transaction";

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({}).populate("categoryId");
    const mappedTransactions = transactions.map((transaction) => ({
      id: transaction._id.toString(),
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      categoryId: transaction.categoryId?._id?.toString() || "",
      categoryName: transaction.categoryId?.name || "Unknown",
      categoryColor: transaction.categoryId?.color || "#000000",
    }));

    return NextResponse.json(mappedTransactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const transaction = await Transaction.create(body);
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
