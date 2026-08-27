'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  short: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'es', name: 'Español', short: 'ES' },
  { code: 'it', name: 'Italiano', short: 'IT' },
  { code: 'de', name: 'Deutsch', short: 'DE' },
  { code: 'ja', name: '日本語', short: 'JA' },
  { code: 'ar', name: 'العربية', short: 'AR' },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguageByCode: (code: string) => void;
  setLanguageByName: (name: string) => void;
  languages: Language[];
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: LANGUAGES[0],
  setLanguageByCode: () => {},
  setLanguageByName: () => {},
  languages: LANGUAGES,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);

  // Apply Google Translate change
  const applyGoogleTranslate = (langCode: string) => {
    if (typeof window === 'undefined') return;

    // Set translation cookie for Google Translate
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;

    // Also trigger change in Google translate combo if present
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  const setLanguageByCode = (code: string) => {
    const found = LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase()) || LANGUAGES[0];
    setCurrentLanguage(found);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_language', found.code);
      applyGoogleTranslate(found.code);
    }
  };

  const setLanguageByName = (name: string) => {
    const found = LANGUAGES.find((l) => l.name.toLowerCase() === name.toLowerCase()) || LANGUAGES[0];
    setCurrentLanguage(found);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_language', found.code);
      applyGoogleTranslate(found.code);
    }
  };

  useEffect(() => {
    // Check saved language on mount
    const saved = localStorage.getItem('selected_language');
    if (saved) {
      const match = LANGUAGES.find((l) => l.code === saved);
      if (match) {
        setCurrentLanguage(match);
      }
    }

    // Initialize Google Translate Script
    if (typeof window !== 'undefined' && !document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,fr,es,it,de,ja,ar',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguageByCode,
        setLanguageByName,
        languages: LANGUAGES,
      }}
    >
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
