import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

// GET all categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find({});
  return NextResponse.json(categories);
}

// POST add new category
export async function POST(req: Request) {
  await dbConnect();
  const { name, type } = await req.json();

  if (!name || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newCategory = await Category.create({ name, type });
  return NextResponse.json(newCategory, { status: 201 });
}
