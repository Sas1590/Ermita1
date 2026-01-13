import React from 'react';
import { useConfig } from '../context/ConfigContext';

interface SpecialtyCardProps {
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ 
  title, 
  subtitle, 
  image, 
  badge 
}) => (
  <div className="group relative h-[500px] w-full overflow-hidden bg-black cursor-pointer shadow-xl">
    {/* Image with zoom effect */}
    <img 
      src={image} 
      alt={title} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50"
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
    
    {/* Badge (optional) */}
    {badge && (
      <div className="absolute top-6 right-6 bg-primary text-black text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-md">
        {badge}
      </div>
    )}

    {/* Content */}
    <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <span className="font-hand text-primary text-2xl block mb-2 opacity-90">{subtitle}</span>
      <h3 className="font-serif text-white text-4xl mb-4 font-bold">{title}</h3>
      
      {/* Divider */}
      <div className="h-0.5 w-12 bg-primary mb-4 transition-all duration-500 group-hover:w-full"></div>
      
      <p className="text-gray-300 font-sans text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-xs leading-relaxed">
        Descobreix els sabors autèntics de la nostra terra, cuinats amb passió i respecte pel producte.
      </p>
    </div>
  </div>
);

const Specialties: React.FC = () => {
  const { config } = useConfig();
  const { specialties } = config;

  const visibleItems = specialties.items.filter((item) => item.visible !== false);

  if (visibleItems.length === 0) {
    return null;
  }

  // Dynamic Layout Logic for Centering
  let containerClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  if (visibleItems.length === 1) {
    containerClasses = "grid grid-cols-1 gap-8 max-w-md mx-auto";
  } else if (visibleItems.length === 2) {
    containerClasses = "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto";
  }

  return (
    <section className="bg-[#1d1a15] bg-dark-texture py-24 text-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-hand text-3xl text-primary -rotate-2 inline-block mb-2">{specialties.sectionTitle}</span>
          <h2 className="font-serif text-5xl md:text-6xl font-bold mb-4">{specialties.mainTitle}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6"></div>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto font-light">
            {specialties.description}
          </p>
        </div>

        <div className={containerClasses}>
          {visibleItems.map((item, index) => (
             <SpecialtyCard 
               key={index}
               title={item.title} 
               subtitle={item.subtitle}
               image={item.image}
               badge={item.badge}
             />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialties;