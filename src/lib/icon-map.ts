// src/lib/icon-map.ts
import { Banknote, Home, LucideIcon, ShoppingBasket } from "lucide-react";

export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case 'salary':
      return Banknote;
    case 'grocery store':
      return ShoppingBasket;
    case 'rent':
      return Home;
    // You can add more cases here for other categories
    default:
      return Banknote; // A fallback icon
  }
};