// src/lib/icon-map.ts
import {
     Banknote, 
     Home, 
     LucideIcon, 
     ShoppingBasket, 
     Bike, 
     ReceiptText, 
     UtensilsCrossed,
     Shapes,
     HeartPulse,
     Ticket,
     Shirt
    } from "lucide-react";

export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case 'salary':
      return Banknote;
    case 'grocery store':
      return ShoppingBasket;
    case 'rent':
      return Home;
    case 'transport':
      return Bike;
    case 'utilities':
      return ReceiptText;
    case 'food & beverages':
      return UtensilsCrossed;
    case 'healthcare': // Renamed from Medical
      return HeartPulse;
    case 'entertainment':
      return Ticket;
    case 'clothing':
      return Shirt;
    default:
      return Banknote;
  }
};