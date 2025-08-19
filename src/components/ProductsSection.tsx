
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import ehsasImage from "@/assets/ehsas-al-arabia.jpg";
import royalMintImage from "@/assets/royal-mint.jpg";
import diorSauvageImage from "@/assets/dior-sauvage.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  target_audience?: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Image mapping for the products
  const imageMap: { [key: string]: string } = {
    'mystic-blossom': ehsasImage,
    'sapphire-sand': royalMintImage,
    'raw-pulse': diorSauvageImage,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching products:', error);
          // Fallback to hardcoded products if database fetch fails
          setProducts([
            {
              id: "mystic-blossom",
              name: "Mystic Blossom",
              description: "A delicate and enchanting fragrance with floral notes that bloom beautifully on the skin. This exquisite attar is specially crafted with feminine elegance in mind, making it the perfect choice for girls who appreciate sophisticated and graceful scents.",
              price: 250,
              target_audience: "girls"
            },
            {
              id: "sapphire-sand",
              name: "Sapphire Sand",
              description: "A bold and mysterious fragrance that captures the essence of desert winds and precious gems. This masculine scent combines earthy undertones with luxurious depth, making it an excellent choice for men who want to make a lasting impression.",
              price: 250,
              target_audience: "men"
            },
            {
              id: "raw-pulse",
              name: "Raw Pulse",
              description: "An intense and dynamic fragrance that embodies raw energy and power. This commanding attar delivers a strong, masculine presence with bold notes that resonate confidence, perfect for men who embrace their inner strength.",
              price: 250,
              target_audience: "men"
            }
          ]);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback products in case of any error
        setProducts([
          {
            id: "mystic-blossom",
            name: "Mystic Blossom",
            description: "A delicate and enchanting fragrance with floral notes that bloom beautifully on the skin. This exquisite attar is specially crafted with feminine elegance in mind, making it the perfect choice for girls who appreciate sophisticated and graceful scents.",
            price: 250,
            target_audience: "girls"
          },
          {
            id: "sapphire-sand",
            name: "Sapphire Sand",
            description: "A bold and mysterious fragrance that captures the essence of desert winds and precious gems. This masculine scent combines earthy undertones with luxurious depth, making it an excellent choice for men who want to make a lasting impression.",
            price: 250,
            target_audience: "men"
          },
          {
            id: "raw-pulse",
            name: "Raw Pulse",
            description: "An intense and dynamic fragrance that embodies raw energy and power. This commanding attar delivers a strong, masculine presence with bold notes that resonate confidence, perfect for men who embrace their inner strength.",
            price: 250,
            target_audience: "men"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-luxury-navy mb-6">
            Our Premium Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated selection of the finest attars, 
            each crafted to perfection and available in premium 6ml bottles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={imageMap[product.id] || ehsasImage}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
