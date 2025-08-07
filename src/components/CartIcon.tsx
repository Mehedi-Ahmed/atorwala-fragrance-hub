import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartIconProps {
  onClick: () => void;
}

const CartIcon = ({ onClick }: CartIconProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        variant="luxury"
        size="lg"
        onClick={onClick}
        className="relative h-14 w-14 rounded-full shadow-luxury"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-navy text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
    </div>
  );
};

export default CartIcon;