"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, Leaf, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import langStyles from './LanguageSelector.module.css';

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const loadUserSession = () => {
        const userStr = localStorage.getItem('kisan_currentUser');
        if (userStr) {
            setIsLoggedIn(true);
            const user = JSON.parse(userStr);
            setProfilePic(user.profilePicture || null);
        } else {
            setIsLoggedIn(false);
            setProfilePic(null);
        }
    };

    useEffect(() => {
        loadUserSession();

        // Listen for profile updates from the Profile page to refresh the avatar instantly
        window.addEventListener('profileUpdated', loadUserSession);
        return () => window.removeEventListener('profileUpdated', loadUserSession);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('kisan_currentUser');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <Leaf className={styles.icon} />
                    <span>Kisan Sahayak</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>{t('home')}</Link>
                    <Link href="/weather" className={`${styles.navLink} ${pathname === '/weather' ? styles.active : ''}`}>{t('weather')}</Link>
                    <Link href="/crops" className={`${styles.navLink} ${pathname === '/crops' ? styles.active : ''}`}>{t('crops')}</Link>
                    <Link href="/market" className={`${styles.navLink} ${pathname === '/market' ? styles.active : ''}`}>
                        {t('market')}
                    </Link>
                    <Link href="/disease-detection" className={`${styles.navLink} ${pathname === '/disease-detection' ? styles.active : ''}`}>
                        {t('disease')}
                    </Link>
                    <Link href="/schemes" className={`${styles.navLink} ${pathname === '/schemes' ? styles.active : ''}`}>
                        {t('schemes')}
                    </Link>

                    {isLoggedIn ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/profile" style={{ display: 'flex', alignItems: 'center' }} title="My Profile">
                                {profilePic ? (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #4caf50' }}>
                                        <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ) : (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#2e7d32', border: '2px solid #4caf50' }}>
                                        <User size={20} />
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>Login</Link>
                    )}

                    <div className={langStyles.languageSelectContainer}>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className={langStyles.languageSelect}
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className={styles.mobileBtn} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/" onClick={() => setIsOpen(false)} className={styles.mobileNavLink}>{t('home')}</Link>
                    <Link href="/weather" onClick={() => setIsOpen(false)} className={styles.mobileNavLink}>{t('weather')}</Link>
                    <Link href="/crops" onClick={() => setIsOpen(false)} className={styles.mobileNavLink}>{t('crops')}</Link>
                    <Link href="/market" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                        {t('market')}
                    </Link>
                    <Link href="/disease-detection" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                        {t('disease')}
                    </Link>
                    <Link href="/schemes" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>{t('schemes')}</Link>

                    {isLoggedIn ? (
                        <>
                            <Link href="/profile" onClick={() => setIsOpen(false)} className={styles.navLink} style={{ color: '#2e7d32', textAlign: 'left', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> मेरी प्रोफ़ाइल (Profile)
                            </Link>
                            <button onClick={() => { setIsOpen(false); handleLogout(); }} className={styles.navLink} style={{ color: '#d32f2f', textAlign: 'left', fontWeight: 'bold' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className={styles.navLink}>{t('login') || 'Login'}</Link>
                    )}

                    <select
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value as any);
                            setIsOpen(false);
                        }}
                        className={langStyles.mobileLangSelect}
                    >
                        <option value="en">English</option>
                        <option value="hi"> हिंदी</option>
                        <option value="pa"> ਪੰਜਾਬੀ</option>
                        <option value="mr"> मराठी</option>
                        <option value="gu"> ગુજરાતી</option>
                        <option value="ta"> தமிழ்</option>
                        <option value="bn"> বাংলা</option>
                    </select>
                </div>
            )}
        </nav>
    );
}
