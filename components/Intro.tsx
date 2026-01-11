import React from 'react';
import { useConfig } from '../context/ConfigContext';

const Intro: React.FC = () => {
  const { config } = useConfig();

  return (
    <section className="bg-beige bg-paper-texture py-10 md:py-14 px-4 relative z-10">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
        
        {/* Compressed Header */}
        <div className="flex flex-col items-center">
            <span className="font-serif italic text-primary text-lg md:text-xl tracking-wider opacity-80">
            {config.intro.smallTitle}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-secondary mt-1 leading-none">
            {config.intro.mainTitle}
            </h2>
        </div>

        {/* Minimal Divider */}
        <div className="h-8 w-px bg-primary/40"></div>

        {/* Integrated Quote - Smaller & Lighter */}
        <p className="font-serif text-lg md:text-xl text-secondary/70 leading-relaxed font-light max-w-2xl mx-auto">
          {config.intro.description}
        </p>

      </div>
    </section>
  );
};

export default Intro;