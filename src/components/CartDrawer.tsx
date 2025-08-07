import { useState } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer = ({ isOpen, onClose, onCheckout }: CartDrawerProps) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    onCheckout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-background h-full overflow-y-auto">
        <div className="p-6 border-b border-luxury-gold/20 bg-gradient-luxury">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-luxury-gold">Your Cart</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-luxury-gold hover:bg-luxury-gold/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
              <Button variant="luxury" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <Card key={item.id} variant="product" className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-luxury-navy">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">৳{item.price} each</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 border-luxury-gold/30"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-semibold text-luxury-navy w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 border-luxury-gold/30"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-luxury-gold">
                            ৳{item.price * item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t border-luxury-gold/20 pt-6">
                <div className="bg-luxury-cream/50 p-4 rounded-lg border border-luxury-gold/20 mb-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-luxury-navy">Total Amount:</span>
                    <span className="font-bold text-luxury-gold">৳{totalPrice}</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-semibold text-luxury-gold bg-luxury-gold/10 px-3 py-1 rounded-full">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="gold" 
                    className="w-full h-12 text-base font-semibold"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-luxury-gold/30 hover:bg-luxury-gold/10"
                    onClick={clearCart}
                    disabled={items.length === 0}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;