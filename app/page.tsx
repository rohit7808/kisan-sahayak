"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';
import Link from 'next/link';
import { CloudSun, Sprout, ShoppingCart, BookOpen } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <Link href="/crops" className="btn-primary">
            {t('getStarted')}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={`container ${styles.features}`}>
        <h2>{t('features')}</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <CloudSun className={styles.icon} />
            <h3>{t('weather')}</h3>
            <p>Real-time weather updates for your farm location.</p>
            <Link href="/weather">Go to Weather</Link>
          </div>
          <div className={styles.card}>
            <Sprout className={styles.icon} />
            <h3>{t('crops')}</h3>
            <p>Smart crop recommendations based on soil and season.</p>
            <Link href="/crops">Go to Crops</Link>
          </div>
          <div className={styles.card}>
            <ShoppingCart className={styles.icon} />
            <h3>{t('market')}</h3>
            <p>Latest mandi prices from markets near you.</p>
            <Link href="/market">Check Prices</Link>
          </div>
          <div className={styles.card}>
            <BookOpen className={styles.icon} />
            <h3>{t('schemes')}</h3>
            <p>Information on government subsidies and schemes.</p>
            <Link href="/schemes">View Schemes</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
