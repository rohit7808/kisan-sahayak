"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';
import { BookOpen } from 'lucide-react';

const SCHEMES = [
    {
        title: 'PM Kisan Samman Nidhi',
        desc: 'Financial benefit of Rs. 6000/- per year to eligible farmer families.',
        link: 'https://pmkisan.gov.in/'
    },
    {
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        desc: 'Crop insurance scheme to provide financial support in case of crop failure.',
        link: 'https://pmfby.gov.in/'
    },
    {
        title: 'Kisan Credit Card (KCC)',
        desc: 'Provides farmers with timely intake of credit at affordable rates.',
        link: '#'
    },
    {
        title: 'Soil Health Card Scheme',
        desc: 'Helps farmers to know the nutrient status of their soil.',
        link: 'https://soilhealth.dac.gov.in/'
    }
];

export default function SchemesPage() {
    const { t } = useLanguage();

    return (
        <div className={`container ${styles.container}`}>
            <h1 className={styles.title}>{t('schemes')}</h1>

            <div className={styles.grid}>
                {SCHEMES.map((scheme, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.header}>
                            <BookOpen className={styles.icon} />
                            <h2>{scheme.title}</h2>
                        </div>
                        <p>{scheme.desc}</p>
                        <a href={scheme.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Learn More &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
