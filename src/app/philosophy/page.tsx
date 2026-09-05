"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useRef } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// Helper function to split text into word spans
const splitTextIntoWords = (text: string) => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="reveal-word">
      {word}
    </span>
  ));
};

export default function Philosophy() {
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Refs for scroll-driven animation
  const sectionsRef = useRef<HTMLDivElement>(null);
  const revealSectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');
    revealSectionsRef.current = Array.from(sections) as HTMLDivElement[];

    let ticking = false;

    const updateScrollProgress = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;

        revealSectionsRef.current.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionHeight = rect.height;

          // Calculate progress based on how much of the tall .reveal-section has been scrolled past.
          // Progress starts when the top of the section is at the top of the viewport (rect.top <= 0).
          // The total scrollable distance is the section's height minus the viewport's height.
          const scrollableDistance = sectionHeight - viewportHeight;
          
          // As we scroll down, rect.top becomes negative. We use this to calculate progress.
          const progress = Math.max(0, Math.min(1, (-rect.top) / scrollableDistance));
          
          // Update word opacity based on progress
          const wordElements = section.querySelectorAll('.reveal-word');
          wordElements.forEach((wordEl, wordIndex) => {
            const element = wordEl as HTMLElement;
            const totalWords = wordElements.length;
            
            // Map the overall section progress to individual word progress.
            const wordProgressStart = wordIndex / totalWords;
            const wordProgressEnd = (wordIndex + 1) / totalWords;
            
            const wordProgress = Math.max(0, Math.min(1, 
              (progress - wordProgressStart) / (wordProgressEnd - wordProgressStart)
            ));
            
            const opacity = 0.2 + (wordProgress * 0.8);
            element.style.opacity = opacity.toString();
          });
        });

        ticking = false;
      });
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    // Initial call
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[100vh] w-full overflow-hidden z-10 mb-8 md:mb-16">
          <div className="absolute inset-0 ">
            <Image 
              src="/hero-philosophy.jpg" 
              alt="Philosophy Hero" 
              fill 
              style={{objectFit: 'cover'}}
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl md:text-7xl font-light mb-4 tracking-widest text-center">OUR PHILOSOPHY</h1>
            <div className="w-20 h-0.5 bg-white"></div>
            <p className="mt-6 max-w-2xl text-center px-4 text-base md:text-lg">
              The essence of luxury lies not in opulence, but in the perfect harmony between form and function.
            </p>
          </div>
        </section>

        {/* Scroll-driven reveal sections */}
        <div ref={sectionsRef} className="reveal-container relative z-20 bg-[#DBD8CF]">
          
          {/* Brand Values Section */}
          <div className="reveal-section mt-8 md:mt-16">
            <div className="reveal-content">
              <motion.section 
                ref={ref1}
                initial={{ opacity: 0, y: 50 }}
                animate={inView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
                className="py-8 md:py-12 px-4 md:px-6"
              >
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords("I - Brand Values")}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"Order is the shape upon which beauty depends" - Pearl S Buck')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed text-center mb-6">
                      {splitTextIntoWords('In a world that trades speed for substance, we anchor ourselves in order, discipline and restraint. At KSHAUM our values are not seasonal - they are eternal')}
                    </p>

                    <div className="text-center mb-4">
                      <p className="text-base md:text-lg font-medium mb-3">
                        {splitTextIntoWords('We believe in:')}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium tracking-wide mb-1">
                            {splitTextIntoWords('QUIET POWER')}
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {splitTextIntoWords('for those who command without noise')}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium tracking-wide mb-1">
                            {splitTextIntoWords('LEGACY OVER TREND')}
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {splitTextIntoWords('because what is inherited must outlast what is admired')}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium tracking-wide mb-1">
                            {splitTextIntoWords('CRAFT OVER COMMERCE')}
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {splitTextIntoWords('true beauty can not be rushed')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium tracking-wide mb-1">
                            {splitTextIntoWords('MEMORY OVER NOVELTY')}
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {splitTextIntoWords('we dress the future with the dignity of the past')}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium tracking-wide mb-1">
                            {splitTextIntoWords('LINEAGE OVER PERSONA')}
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {splitTextIntoWords('one does not wear KSHAUM to be seen one wears it to belong')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>

          {/* Craftsmanship Section */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('II - Craftsmanship')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"We are what we repeatedly do, Excellence then it is not an act but a habit" - Aristotle (Greece)')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('At KSHAUM we use only what breathes with body and listens to soul. Linen, cotton, silk - fibers that hold frequency absorb intention and age with nobility. In Ayurveda these are "JEEVAN VASTRA" life bearing cloth.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('Craftsmanship is sacred. To craft is to create eternity in a Moment. In Sanskrit it is called "SHILPA" the art and discipline that binds Spirit to form.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Cultural and Historical Foundations */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('III - Cultural and Historical Foundations')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"To know nothing of what happened before you were born is to remain forever a child" - Cicero (Rome)')}
                    </blockquote>

                    <div className="space-y-3 text-base md:text-lg leading-relaxed">
                      <p>{splitTextIntoWords('We do not draw from mood-boards')}</p>
                      <p>{splitTextIntoWords('We draw from empires.')}</p>
                      <p>{splitTextIntoWords('We believe civilisation is couture')}</p>
                      <p>{splitTextIntoWords('To wear our garments is to walk with dignity of dynasties.')}</p>
                      <p>{splitTextIntoWords('We invoke the Sanskrit principle of "KAAL CHAKRA" - The wheel of time where fashion is not seasonal but cyclical sacred and eternal.')}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Philosophy of Dress */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('IV - Philosophy of Dress')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"Clothing is but a symbol of the soul made visible" - Hazrat Ali (7th century) caliph, Persia')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('At KSHAUM attire is not decoration - it is declaration. They belong to those who carry burden without display grace without audience.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('We dress to be remembered by descendants.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Aesthetic Ethos */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('V - Aesthetic Ethos')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"Simplicity is the final achievement. After one has played a vast quantity of notes, it is simplicity that emerges as the crowning reward" - Frédéric Chopin (Poland)')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('In the ancient Chinese concept of "wu wei - effortless action" We find our direction - effort that disappears and mastery that whispers.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('No logos no faces not noise. We do not chase the eye we rest in the mind.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Legacy and Lineage */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('VI - Legacy and Lineage')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"A man does not plant a tree for himself, he plants it for his Children and his children\'s children" - Cicero (Rome)')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('We design for the house the heir and the history yet to be written. KSHAUM belongs to the families who build slowly, suffer quietly, and endure without applause. Those who know that luxury is not ownership - it is inheritance.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('In Sanskrit there\'s word "VANSHA" - a sacred line of ancestry. We clothe Vansha bearing those who understand that their life is part of longer thread. Every stitch we make is for the preservation of name, honour and continuity.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed font-medium">
                      {splitTextIntoWords('Because in the end style fades but houses remains.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* What We Reject */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('VII - What We Reject')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"Give me a place to stand and I will move the earth" - Archimedes (Greece)')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('We have chosen our place now we draw the line. We refuse the theatric of trend, the hollowness of hype and the tyranny of relevance.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('DHARMA - a personal law even when the world tempts disloyalty our is dharma is creation of restraint.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed font-medium">
                      {splitTextIntoWords('Let others chase the wind - We will build the mountain. The house kneels to no season no crowd no noise it bows only to craft, culture and continuity.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Philosophy of Time */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('VIII - Philosophy of Time')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"Time is a created thing to say I don\'t have time is like saying I don\'t want to" - Lao Tzu (China)')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('We craft for the moment that matter the years that define legacy and the generations that inherit. Because true luxury is not bought today to be forgotten tomorrow, but lived as heritage.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* The Sacred Textile */}
          <div className="reveal-section">
            <div className="reveal-content">
              <section className="py-8 md:py-12 px-4 md:px-6">
                <div className="mx-4 md:mx-auto max-w-4xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] mb-4 uppercase text-black mt-0 pt-0">
                      {splitTextIntoWords('IX - The Sacred Textile')}
                    </h2>
                    <div className="w-20 h-0.5 bg-black mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-black">
                    <blockquote className="text-lg md:text-xl italic text-center mb-6">
                      {splitTextIntoWords('"Clothes are the second skin, the first being our flesh" - Proverb from ancient India')}
                    </blockquote>

                    <p className="text-base md:text-lg leading-relaxed">
                      {splitTextIntoWords('In Vedic philosophy natural fabrics are considered "SATTVIC" - pure harmonious and elevating to the human aura. They resonate with the body\'s own frequency creating a symphony of balance between wearer and garment.')}
                    </p>

                    <p className="text-base md:text-lg leading-relaxed font-medium">
                      {splitTextIntoWords('To wear KSHAUM is to wrap oneself in history, energy and sanctity.')}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

        </div>

        {/* Final Quote Section */}
        <section className="py-12 md:py-16 px-4 bg-black text-white text-center">
          <div className="mx-4 md:mx-auto max-w-4xl">
            <p className="text-xl md:text-3xl font-light italic">
              "In the end, style fades but houses remain."
            </p>
            <div className="w-20 h-0.5 bg-white mx-auto my-4"></div>
            <p className="uppercase tracking-widest">KSHAUM</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
