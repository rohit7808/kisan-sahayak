"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'pa' | 'mr' | 'gu' | 'ta' | 'bn';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
    home: {
        en: 'Home', hi: 'होम', pa: 'ਘਰ', mr: 'गृह', gu: 'ઘર', ta: 'முகப்பு', bn: 'বাড়ি'
    },
    weather: {
        en: 'Weather', hi: 'मौसम', pa: 'ਮੌਸਮ', mr: 'हवामान', gu: 'હવામાન', ta: 'வானிலை', bn: 'আবহাওয়া'
    },
    crops: {
        en: 'Crops', hi: 'फसलें', pa: 'ਫਸਲਾਂ', mr: 'पिके', gu: 'પાક', ta: 'பயிர்கள்', bn: 'ফসল'
    },
    market: {
        en: 'Market Price', hi: 'मंडी भाव', pa: 'ਮੰਡੀ ਭਾਅ', mr: 'बाजार भाव', gu: 'બજાર ભાવ', ta: 'சந்தை விலை', bn: 'বাজার দর'
    },
    schemes: {
        en: 'Schemes', hi: 'योजनाएं', pa: 'ਸਕੀਮਾਂ', mr: 'योजना', gu: 'યોજનાઓ', ta: 'திட்டங்கள்', bn: 'প্রকল্প'
    },
    disease: {
        en: 'Disease Detection', hi: 'रोग पहचान', pa: 'ਰੋਗ ਦੀ ਪਛਾਣ', mr: 'रोग शोध', gu: 'રોગની ઓળખ', ta: 'நோய் கண்டறிதல்', bn: 'রোগ সনাক্তকরণ'
    },
    login: {
        en: 'Login', hi: 'लॉग इन', pa: 'ਲੌਗ ਇਨ', mr: 'लॉग इन', gu: 'લોગ ઇન', ta: 'உள்நுழை', bn: 'লগ ইন'
    },
    heroTitle: {
        en: 'Empowering Farmers with Technology',
        hi: 'तकनीक के साथ किसानों को सशक्त बनाना',
        pa: 'ਤਕਨਾਲੋਜੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ',
        mr: 'तंत्रज्ञानाद्वारे शेतकऱ्यांना सक्षम करणे',
        gu: 'ટેકનોલોજી સાથે ખેડૂતોને સશક્ત બનાવવું',
        ta: 'தொழில்நுட்பத்துடன் விவசாயிகளுக்கு அதிகாரம் அளித்தல்',
        bn: 'প্রযুক্তির মাধ্যমে কৃষকদের ক্ষমতায়ন'
    },
    heroSubtitle: {
        en: 'Get crop recommendations, weather updates, and market prices in one place.',
        hi: 'फसल सलाह, मौसम अपडेट और मंडी भाव एक ही जगह प्राप्त करें।',
        pa: 'ਇੱਕ ਥਾਂ ਤੇ ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ, ਮੌਸਮ ਅਪਡੇਟ ਅਤੇ ਮੰਡੀ ਭਾਅ ਪ੍ਰਾਪਤ ਕਰੋ।',
        mr: 'पीक शिफारसी, हवामान अद्यतने आणि बाजार भाव एकाच ठिकाणी मिळवा.',
        gu: 'પાક ભલામણો, હવામાન અપડેટ્સ અને બજાર ભાવ એક જ સ્થળે મેળવો.',
        ta: 'பயிர் பரிந்துரைகள், வானிலை புதுப்பிப்புகள் மற்றும் சந்தை விலைகளை ஒரே இடத்தில் பெறுங்கள்.',
        bn: 'এক জায়গায় ফসল সুপারিশ, আবহাওয়া আপডেট এবং বাজার দর পান।'
    },
    getStarted: {
        en: 'Get Started', hi: 'शुरू करें', pa: 'ਸ਼ੁਰੂ ਕਰੋ', mr: 'सुरु करा', gu: 'શરૂ કરો', ta: 'தொடங்கவும்', bn: 'শুরু করুন'
    },
    features: {
        en: 'Our Features', hi: 'हमारी विशेषताएं', pa: 'ਸਾਡੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ', mr: 'आमची वैशिष्ट्ये', gu: 'અમારી વિશેષતાઓ', ta: 'எங்கள் அம்சங்கள்', bn: 'আমাদের বৈশিষ্ট্য'
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('kisanSahayakLang') as Language;
        if (storedLang && ['en', 'hi', 'pa', 'mr', 'gu', 'ta', 'bn'].includes(storedLang)) {
            setLanguageState(storedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('kisanSahayakLang', lang);
    };

    const t = (key: string) => {
        return translations[key]?.[language] || translations[key]?.['en'] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
