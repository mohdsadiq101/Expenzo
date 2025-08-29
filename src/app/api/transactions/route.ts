// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

// GET all transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new transaction
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    let { title, amount, category, type } = body;

    if (!title || !amount || !category || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Convert amount to number
    amount = Number(amount);

    if (isNaN(amount)) {
      return NextResponse.json({ error: "Amount must be a number" }, { status: 400 });
    }

    const newTransaction = await Transaction.create({
      title,
      amount,
      category,
      type,
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
