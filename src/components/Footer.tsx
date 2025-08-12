const Footer = () => {
  return (
    <footer className="bg-gradient-luxury text-luxury-gold py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Atorwala</h3>
          <p className="text-luxury-cream/80 mb-6 max-w-2xl mx-auto">
            Premium attars delivered with care. Experience the finest traditional fragrances 
            crafted for the modern connoisseur.
          </p>
          
          <div className="border-t border-luxury-gold/20 pt-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-semibold mb-2 text-luxury-gold">Payment</h4>
                <p className="text-luxury-cream/70">Cash on Delivery Only</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-luxury-gold">Delivery</h4>
                <p className="text-luxury-cream/70">Fast & Secure Delivery</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-luxury-gold">Quality</h4>
                <p className="text-luxury-cream/70">Premium 6ml Bottles</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-luxury-gold/20 pt-6 mt-8">
            <p className="text-luxury-cream/60 text-sm">
              © 2025 Atorwala. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
