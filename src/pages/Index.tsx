import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import CartIcon from "@/components/CartIcon";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";

const Index = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen">
        <HeroSection />
        <ProductsSection />
        <Footer />
        <CartIcon onClick={() => setIsCartOpen(true)} />
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
        <OrderForm 
          isOpen={isOrderFormOpen}
          onClose={() => setIsOrderFormOpen(false)}
        />
      </div>
    </CartProvider>
  );
};

export default Index;
