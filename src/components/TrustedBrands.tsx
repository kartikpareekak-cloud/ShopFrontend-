const TrustedBrands = () => {
  const brands = [
    "Roots",
    "Uno Minda", 
    "Hi-Lux",
    "LuminEye",
    "HJG",
    "Trusted Picks"
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-automotive mb-4">Trusted Brands</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner with the most trusted names in automotive accessories to bring you quality products you can rely on.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <div 
              key={brand}
              className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center group cursor-pointer"
            >
              <div className="h-16 flex items-center justify-center mb-4 bg-metallic/20 rounded-lg group-hover:bg-primary/10 transition-colors">
                <span className="text-2xl font-bold text-automotive group-hover:text-primary transition-colors">
                  {brand.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
              <h3 className="font-semibold text-automotive text-sm">{brand}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;