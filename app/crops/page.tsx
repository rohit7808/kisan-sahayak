"use client";

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';
import { Sprout, AlertCircle } from 'lucide-react';

// Client-side crop data for instant recommendations
const CROP_DATA = [
    {
        name: 'Wheat (गेहूं)',
        soil: ['Clay', 'Alluvial', 'Loamy'],
        season: ['Rabi'],
        desc: 'Requires cool weather and moderate water.'
    },
    {
        name: 'Mustard (सरसों)',
        soil: ['Alluvial', 'Clay', 'Loamy'],
        season: ['Rabi'],
        desc: 'Less water needed, good for winter.'
    },
    {
        name: 'Barley (जौ)',
        soil: ['Clay', 'Sandy', 'Loamy'],
        season: ['Rabi'],
        desc: 'Hardy crop, grows in various soils.'
    },
    {
        name: 'Bajra (बाजरा)',
        soil: ['Sandy', 'Alluvial'],
        season: ['Kharif', 'Zaid'],
        desc: 'Drought tolerant, good for dry regions.'
    },
    {
        name: 'Groundnut (मूंगफली)',
        soil: ['Sandy', 'Red', 'Loamy'],
        season: ['Kharif'],
        desc: 'Oilseed, nitrogen fixing for soil.'
    },
    {
        name: 'Cotton (कपास)',
        soil: ['Black', 'Alluvial'],
        season: ['Kharif'],
        desc: 'Cash crop, requires black soil.'
    },
    {
        name: 'Rice (चावल)',
        soil: ['Clay', 'Alluvial'],
        season: ['Kharif'],
        desc: 'High water requirement.'
    },
    {
        name: 'Watermelon (तरबूज)',
        soil: ['Sandy', 'Loamy'],
        season: ['Zaid'],
        desc: 'Summer fruit, sandy riverbed soil is best.'
    },
    {
        name: 'Vegetables (सब्जियाँ)',
        soil: ['Loamy', 'Alluvial'],
        season: ['Zaid', 'Rabi', 'Kharif'],
        desc: 'Short duration crops like cucumber, gourd.'
    }
];

export default function CropsPage() {
    const { t } = useLanguage();
    const [recommendations, setRecommendations] = useState<typeof CROP_DATA | null>(null);
    const [error, setError] = useState('');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        const formData = new FormData(e.currentTarget);
        const soil = formData.get('soilType') as string;
        const season = formData.get('season') as string;

        // Validation
        if (!soil || !season) {
            setError('Please select both Soil Type and Season.');
            setRecommendations(null);
            return;
        }

        // Logic: Filter crops that match BOTH soil and season
        const filteredCrops = CROP_DATA.filter(crop =>
            crop.soil.includes(soil) && crop.season.includes(season)
        );

        setRecommendations(filteredCrops);
    }

    return (
        <div className={`container ${styles.container}`}>
            <h1 className={styles.title}>{t('crops')} Recommendation</h1>

            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="soilType">Soil Type / मिट्टी का प्रकार</label>
                        <select name="soilType" id="soilType">
                            <option value="">Select Soil Type</option>
                            <option value="Clay">Clay (चिकनी)</option>
                            <option value="Sandy">Sandy (रेतीली)</option>
                            <option value="Loamy">Loamy (दोमट)</option>
                            <option value="Black">Black (कपासी)</option>
                            <option value="Alluvial">Alluvial (जलोढ़)</option>
                            <option value="Red">Red (लाल)</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="season">Season / मौसम</label>
                        <select name="season" id="season">
                            <option value="">Select Season</option>
                            <option value="Kharif">Kharif (Monsoon - June to Oct)</option>
                            <option value="Rabi">Rabi (Winter - Oct to March)</option>
                            <option value="Zaid">Zaid (Summer - March to June)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">
                        Get Recommendations
                    </button>
                </form>

                {error && (
                    <div className={styles.error}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className={styles.results}>
                    {recommendations && (
                        <div className={styles.resultGrid}>
                            {recommendations.length > 0 ? (
                                recommendations.map((crop, index) => (
                                    <div key={index} className={styles.cropCard}>
                                        <Sprout size={32} className={styles.icon} />
                                        <h3>{crop.name}</h3>
                                        <p>{crop.desc}</p>
                                        <div className={styles.tags}>
                                            <span>{crop.soil.find(s => s === (document.getElementById('soilType') as HTMLSelectElement)?.value) || crop.soil[0]}</span>
                                            <span>{crop.season.find(s => s === (document.getElementById('season') as HTMLSelectElement)?.value) || crop.season[0]}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResult}>
                                    <p>No specific crop matches found for this combination.</p>
                                    <p>Try changing the soil or season.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
