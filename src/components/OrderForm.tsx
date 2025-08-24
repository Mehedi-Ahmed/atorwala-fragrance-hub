import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderForm = ({ isOpen, onClose }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    promoCode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const { toast } = useToast();
  const { items, getTotalPrice, clearCart } = useCart();

  const totalPrice = getTotalPrice();
  const discountAmount = (totalPrice * promoDiscount) / 100;
  const finalPrice = totalPrice - discountAmount;

  const validatePromoCode = async (code: string) => {
    if (!code.trim()) {
      setPromoDiscount(0);
      setPromoApplied(false);
      return;
    }

    setIsValidatingPromo(true);
    try {
      const { data, error } = await supabase.rpc('validate_promo_code', { code: code.trim() });
      
      if (error) {
        console.error('Error validating promo code:', error);
        setPromoDiscount(0);
        setPromoApplied(false);
        return;
      }

      if (data && data.length > 0) {
        const result = data[0];
        if (result.is_valid) {
          setPromoDiscount(result.discount_percent);
          setPromoApplied(true);
          toast({
            title: "Promo Code Applied!",
            description: `${result.discount_percent}% discount applied to your order.`,
          });
        } else {
          setPromoDiscount(0);
          setPromoApplied(false);
          toast({
            title: "Invalid Promo Code",
            description: "The promo code you entered is not valid.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Promo code validation error:', error);
      setPromoDiscount(0);
      setPromoApplied(false);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleApplyPromo = () => {
    validatePromoCode(formData.promoCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || items.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and ensure your cart is not empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase.rpc('generate_order_number');
      
      if (orderNumberError) {
        console.error('Error generating order number:', orderNumberError);
        throw orderNumberError;
      }

      const orderNumber = orderNumberData;

      // Prepare items for JSON storage
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price
      }));

      // Create single order record with all information using correct field names
      const orderRecord = {
        order_number: orderNumber,
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        special_notes: formData.notes || null,
        items: orderItems,
        subtotal: totalPrice,
        promo_code: formData.promoCode || null,
        discount_percentage: promoDiscount,
        discount_amount: discountAmount,
        total_amount: finalPrice,
        status: 'pending'
      };

      console.log('Submitting order:', orderRecord);

      const { error: insertError } = await supabase
        .from('orders')
        .insert(orderRecord as any);

      if (insertError) {
        console.error('Error creating order:', insertError);
        throw insertError;
      }

      // Success!
      toast({
        title: "Order Placed Successfully!",
        description: `Order ${orderNumber} for ${items.length} item(s) totaling ৳${finalPrice.toFixed(2)} has been received. We'll contact you shortly!`,
      });

      // Reset form, clear cart and close
      setFormData({ name: "", phone: "", address: "", notes: "", promoCode: "" });
      setPromoDiscount(0);
      setPromoApplied(false);
      clearCart();
      onClose();

    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset promo code application when the code changes
    if (field === "promoCode" && promoApplied) {
      setPromoDiscount(0);
      setPromoApplied(false);
    }
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
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                rows={3}
                className="border-luxury-gold/30 focus:border-luxury-gold resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promoCode" className="text-luxury-navy font-semibold">
                Promo Code (Optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="promoCode"
                  type="text"
                  value={formData.promoCode}
                  onChange={(e) => handleInputChange("promoCode", e.target.value)}
                  placeholder="Enter promo code (e.g., AW10)"
                  disabled={isSubmitting || isValidatingPromo}
                  className="border-luxury-gold/30 focus:border-luxury-gold flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={isSubmitting || isValidatingPromo || !formData.promoCode.trim() || promoApplied}
                  className="border-luxury-gold/30 text-luxury-navy hover:bg-luxury-gold/10"
                >
                  {isValidatingPromo ? "..." : promoApplied ? "Applied" : "Apply"}
                </Button>
              </div>
              {isValidatingPromo && (
                <p className="text-sm text-luxury-navy/70">Validating promo code...</p>
              )}
              {promoDiscount > 0 && promoApplied && (
                <p className="text-sm text-green-600 font-semibold">
                  {promoDiscount}% discount applied!
                </p>
              )}
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
                disabled={isSubmitting}
                className="border-luxury-gold/30 focus:border-luxury-gold resize-none"
              />
            </div>

            <div className="bg-luxury-navy/5 p-6 rounded-lg border border-luxury-navy/20">
              <h4 className="font-bold text-luxury-navy mb-4 text-lg">Order Summary</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-luxury-navy/10">
                    <div>
                      <span className="font-semibold text-luxury-navy">{item.name}</span>
                      <span className="text-sm text-luxury-navy/70 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-luxury-navy">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="border-luxury-navy/30 my-4" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-luxury-navy">Subtotal:</span>
                  <span className="text-luxury-navy">৳{totalPrice.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && promoApplied && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount ({promoDiscount}%):</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-luxury-navy">Total Amount:</span>
                  <span className="font-bold text-luxury-navy text-xl">৳{finalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-center pt-2">
                <span className="text-sm font-semibold text-luxury-navy bg-luxury-navy/10 px-3 py-1 rounded-full">
                  Cash on Delivery (COD)
                </span>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="gold" 
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
