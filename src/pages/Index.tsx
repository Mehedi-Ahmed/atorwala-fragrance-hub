import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

const Index = () => {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleProductOrder = (productName: string) => {
    setSelectedProduct(productName);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setSelectedProduct("");
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProductsSection onProductOrder={handleProductOrder} />
      <Footer />
      <OrderForm 
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default Index;
