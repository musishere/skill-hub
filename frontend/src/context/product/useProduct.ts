import { useContext } from "react";
import { ProductContext } from "./ProductContext";

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}