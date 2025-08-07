import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: string;
}

const OrderForm = ({ isOpen, onClose, selectedProduct }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the order to your backend
    toast({
      title: "Order Received!",
      description: `Your order for ${selectedProduct} has been received. We'll contact you shortly to confirm delivery details.`,
    });

    // Reset form and close
    setFormData({ name: "", phone: "", address: "", notes: "" });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card variant="luxury" className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold text-luxury-navy">
            Order {selectedProduct}
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

            <div className="bg-luxury-cream/50 p-4 rounded-lg border border-luxury-gold/20">
              <h4 className="font-semibold text-luxury-navy mb-2">Order Summary</h4>
              <p className="text-sm text-luxury-navy/80 mb-1">Product: {selectedProduct}</p>
              <p className="text-sm text-luxury-navy/80 mb-1">Size: 6ml Premium Bottle</p>
              <p className="text-sm font-semibold text-luxury-gold">Payment: Cash on Delivery (COD)</p>
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