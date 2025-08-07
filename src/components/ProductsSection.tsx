import ProductCard from "./ProductCard";
import ehsasImage from "@/assets/ehsas-al-arabia.jpg";
import royalMintImage from "@/assets/royal-mint.jpg";
import diorSauvageImage from "@/assets/dior-sauvage.jpg";

interface ProductsSectionProps {
  onProductOrder: (productName: string) => void;
}

const ProductsSection = ({ onProductOrder }: ProductsSectionProps) => {
  const products = [
    {
      name: "Ehsas Al Arabia",
      image: ehsasImage,
      description: "A captivating blend of traditional Arabian notes with modern sophistication. This exquisite attar embodies the essence of Middle Eastern luxury."
    },
    {
      name: "Royal Mint",
      image: royalMintImage,
      description: "Fresh and invigorating, this premium attar combines the coolness of mint with royal elegance. Perfect for those who appreciate refined freshness."
    },
    {
      name: "Dior Sauvage",
      image: diorSauvageImage,
      description: "A bold and wild fragrance that captures the spirit of wide-open spaces. This interpretation brings luxury and intensity in every drop."
    }
  ];

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
              key={product.name}
              name={product.name}
              image={product.image}
              description={product.description}
              onOrder={onProductOrder}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;