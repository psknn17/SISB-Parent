import { useState } from "react";
import { CartView } from "@/components/portal/CartView";
import { useLanguage } from "@/contexts/LanguageContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'course' | 'activity';
  studentName?: string;
}

interface CreditNote {
  id: number;
  student_id: number;
  balance: number;
  items: { title: string; amount: number; }[];
}

interface CartPageProps {
  items: CartItem[];
  creditNotes: CreditNote[];
  onRemoveItem: (itemId: string) => void;
  onCheckout: (items: CartItem[]) => void;
  onBackToPortal: () => void;
}

export const CartPage = ({ items, creditNotes, onRemoveItem, onCheckout, onBackToPortal }: CartPageProps) => {
  const handleCheckout = (selectedItems: CartItem[]) => {
    onCheckout(selectedItems);
  };

  return (
    <CartView
      items={items}
      creditNotes={creditNotes}
      onRemoveItem={onRemoveItem}
      onCheckout={handleCheckout}
      onBack={onBackToPortal}
    />
  );
};