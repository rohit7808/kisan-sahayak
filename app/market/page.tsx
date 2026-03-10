"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

const MARKET_DATA = [
    { crop: 'Wheat', market: 'Azadpur Mandi', price: 2150, date: '2024-02-03' },
    { crop: 'Rice (Basmati)', market: 'Karnal Mandi', price: 3800, date: '2024-02-03' },
    { crop: 'Mustard', market: 'Jaipur Mandi', price: 5600, date: '2024-02-02' },
    { crop: 'Cotton', market: 'Akola Mandi', price: 6200, date: '2024-02-03' },
    { crop: 'Onion', market: 'Nasik Mandi', price: 1800, date: '2024-02-03' },
    { crop: 'Potato', market: 'Agra Mandi', price: 800, date: '2024-02-02' },
];

export default function MarketPage() {
    const { t } = useLanguage();

    return (
        <div className={`container ${styles.container}`}>
            <h1 className={styles.title}>{t('market')}</h1>
            <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</p>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Crop</th>
                            <th>Market (Mandi)</th>
                            <th>Price (₹/Quintal)</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MARKET_DATA.map((item, index) => (
                            <tr key={index}>
                                <td>{item.crop}</td>
                                <td>{item.market}</td>
                                <td className={styles.price}>₹{item.price}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
