
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-luxury/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/026a6b78-c65c-4a51-b329-2db8263e4aef.png" 
            alt="Atorwala Logo" 
            className="mx-auto h-24 md:h-32 w-auto object-contain"
          />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-luxury-gold mb-6 tracking-wide">
        Atorwala
        </h1>
        <p className="text-xl md:text-2xl text-luxury-cream mb-8 leading-relaxed">
          Crafting Scents, Creating Memories
        </p>
        <p className="text-lg text-luxury-cream/80 mb-12 max-w-2xl mx-auto">
          Experience the finest collection of traditional fragrances, 
          crafted with passion and delivered to your doorstep
        </p>
        <Button 
          variant="gold" 
          size="lg" 
          onClick={scrollToProducts}
          className="text-lg px-12 py-6 h-auto"
        >
          Explore Our Collection
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-luxury-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-luxury-gold/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
