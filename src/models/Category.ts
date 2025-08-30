import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
