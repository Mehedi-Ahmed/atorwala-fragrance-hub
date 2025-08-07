import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderForm = ({ isOpen, onClose }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCart();

  const totalPrice = getTotalPrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || items.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and ensure your cart is not empty.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the order to your backend
    toast({
      title: "Order Received!",
      description: `Your order for ${items.length} item(s) totaling ৳${totalPrice} has been received. We'll contact you shortly!`,
    });

    // Reset form, clear cart and close
    setFormData({ name: "", phone: "", address: "", notes: "" });
    clearCart();
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || items.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card variant="luxury" className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-luxury-navy">
            Complete Your Order
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 text-luxury-navy hover:bg-luxury-gold/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-luxury-navy font-semibold">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
                className="border-luxury-gold/30 focus:border-luxury-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-luxury-navy font-semibold">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
                className="border-luxury-gold/30 focus:border-luxury-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-luxury-navy font-semibold">
                Delivery Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your complete delivery address"
                required
                rows={3}
                className="border-luxury-gold/30 focus:border-luxury-gold resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-luxury-navy font-semibold">
                Special Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any special delivery instructions or notes"
                rows={2}
                className="border-luxury-gold/30 focus:border-luxury-gold resize-none"
              />
            </div>

            <div className="bg-luxury-cream/50 p-6 rounded-lg border border-luxury-gold/20">
              <h4 className="font-bold text-luxury-navy mb-4 text-lg">Order Summary</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-luxury-gold/10">
                    <div>
                      <span className="font-semibold text-luxury-navy">{item.name}</span>
                      <span className="text-sm text-luxury-navy/70 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-luxury-navy">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="border-luxury-gold/30 my-4" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-luxury-navy">Total Amount:</span>
                <span className="font-bold text-luxury-gold">৳{totalPrice}</span>
              </div>
              <div className="text-center pt-2">
                <span className="text-sm font-semibold text-luxury-gold bg-luxury-gold/10 px-3 py-1 rounded-full">
                  Cash on Delivery (COD)
                </span>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="gold" 
              className="w-full h-12 text-base font-semibold"
            >
              Place Order
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;