import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  image: string;
  description: string;
  onOrder: (productName: string) => void;
}

const ProductCard = ({ name, image, description, onOrder }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      variant="product"
      className="group overflow-hidden transition-all duration-500 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`w-full h-80 object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-luxury/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-luxury-navy mb-3 group-hover:text-luxury-gold transition-colors duration-300">
          {name}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-luxury-navy/70">
          <span className="font-semibold">6ml Premium Bottle</span>
          <span className="text-luxury-gold font-bold">COD Available</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          variant="luxury" 
          className="w-full h-12 text-base font-semibold"
          onClick={() => onOrder(name)}
        >
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;