"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from '@/components/Auth.module.css';
import { Loader2, RefreshCw } from 'lucide-react';

export default function LoginPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ identifier: '', password: '', captcha: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    // Simple static captcha for demo
    const [captchaCode, setCaptchaCode] = useState('AK72');

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.identifier) newErrors.identifier = 'ईमेल या मोबाइल नंबर आवश्यक है (Email/Mobile required)';
        if (!formData.password) newErrors.password = 'पासवर्ड आवश्यक है (Password required)';
        if (formData.captcha !== captchaCode) newErrors.captcha = 'गलत CAPTCHA (Incorrect CAPTCHA)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // Simulate API call and Local Storage Check
        setTimeout(() => {
            setLoading(false);
            const usersStr = localStorage.getItem('kisan_users');
            const users = usersStr ? JSON.parse(usersStr) : [];

            // Built-in Demo User for ease of testing
            const demoMatch = formData.identifier === 'demo' && formData.password === 'demo123';

            const match = users.find(
                (u: any) => (u.mobile === formData.identifier || u.email === formData.identifier) && u.password === formData.password
            );

            if (match || demoMatch) {
                const userSession = match || { name: 'Demo Farmer', mobile: '9999999999', email: 'demo@demo.com' };
                localStorage.setItem('kisan_currentUser', JSON.stringify(userSession));
                alert('लॉगिन सफल (Login Successful)! Redirecting to Dashboard...');
                window.location.href = '/';
            } else {
                setErrors({ identifier: 'अवैध क्रेडेंशियल्स (Invalid credentials)', password: 'अवैध क्रेडेंशियल्स (Invalid credentials)' });
            }
        }, 1500);
    };

    const refreshCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(result);
        setFormData(prev => ({ ...prev, captcha: '' }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>लॉग इन करें (Sign In)</h1>
                <p className={styles.subtitle}>वापसी पर स्वागत है, किसान भाई!</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>ईमेल या मोबाइल नंबर (Email or Mobile)</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="अपना ईमेल या मोबाइल दर्ज करें"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        />
                        {errors.identifier && <span className={styles.errorText}>{errors.identifier}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>पासवर्ड (Password)</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="अपना पासवर्ड डालें"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>सुरक्षा जाँच (Security Check)</label>
                        <div className={styles.captchaContainer}>
                            <span className={styles.captchaBox}>{captchaCode}</span>
                            <button type="button" onClick={refreshCaptcha} style={{ background: 'none', border: 'none' }}>
                                <RefreshCw size={20} color="#2e7d32" />
                            </button>
                        </div>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="CAPTCHA कोड दर्ज करें"
                            value={formData.captcha}
                            onChange={(e) => setFormData({ ...formData, captcha: e.target.value.toUpperCase() })}
                        />
                        {errors.captcha && <span className={styles.errorText}>{errors.captcha}</span>}
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ padding: '16px', fontSize: '18px', borderRadius: '12px' }}>
                        {loading ? <Loader2 className="animate-spin inline" /> : 'लॉग इन करें (Sign In)'}
                    </button>
                </form>

                {/* Demo Helper Text */}
                <p style={{ marginTop: '1rem', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                    *For demo, you can login with ID: <b>demo</b> and Password: <b>demo123</b>
                </p>

                <p className={styles.linkText}>
                    क्या आपका खाता नहीं है? <Link href="/register" className={styles.link}>यहां रजिस्टर करें (Register)</Link>
                </p>
            </div>
        </div>
    );
}
