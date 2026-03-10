"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/components/Auth.module.css';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.fullName) newErrors.fullName = 'पूरा नाम आवश्यक है (Name is required)';
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'सही 10-अंकीय मोबाइल नंबर आवश्यक है (Valid Mobile is required)';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'सही ईमेल आवश्यक है (Valid Email is required)';
        if (!formData.password || formData.password.length < 6) newErrors.password = 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password min 6 chars)';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'पासवर्ड मेल नहीं खाते (Passwords mismatch)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGetOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep1()) return;

        setLoading(true);
        // Simulate sending OTP
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            alert(`OTP भेजा गया +91-${formData.mobile} और ${formData.email} पर। (Demo OTP: 1234)`);
        }, 1000);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.otp !== '1234') {
            setErrors({ otp: 'अमान्य OTP (Invalid OTP). Try 1234.' });
            return;
        }

        setLoading(true);
        // Save user to Local Storage
        setTimeout(() => {
            setLoading(false);
            const usersStr = localStorage.getItem('kisan_users');
            const users = usersStr ? JSON.parse(usersStr) : [];

            // Check if already registered
            if (users.find((u: any) => u.mobile === formData.mobile || u.email === formData.email)) {
                alert('यह विवरण पहले से पंजीकृत है (Already registered). कृपया लॉगिन करें।');
                window.location.href = '/login';
                return;
            }

            users.push({
                name: formData.fullName,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('kisan_users', JSON.stringify(users));
            alert('पंजीकरण सफल (Registration Successful)! Redirecting to Login...');
            window.location.href = '/login';
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>खाता बनाएँ (Register)</h1>
                <p className={styles.subtitle}>{step === 1 ? 'किसान सहायक समुदाय से जुड़ें' : 'अपना मोबाइल नंबर सत्यापित करें'}</p>

                {step === 1 && (
                    <form onSubmit={handleGetOTP} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>पूरा नाम (Full Name)</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="अपना पूरा नाम दर्ज करें"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>मोबाइल नंबर (Mobile Number)</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="मोबाइल नंबर (जैसे: 9876543210)"
                                maxLength={10}
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                            />
                            {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>ईमेल (Email)</label>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="अपना ईमेल दर्ज करें"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>पासवर्ड (Password)</label>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="पासवर्ड बनाएँ"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>पासवर्ड की पुष्टि करें (Confirm Password)</label>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="पासवर्ड फिर से लिखें"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading} style={{ padding: '16px', fontSize: '18px', borderRadius: '12px' }}>
                            {loading ? <Loader2 className="animate-spin inline" /> : 'OTP प्राप्त करें (Get OTP)'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <div className={styles.otpSection}>
                            <p>+91-{formData.mobile} पर भेजा गया 4-अंकीय कोड दर्ज करें</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label>OTP कोड</label>
                            <input
                                type="text"
                                className={`${styles.input} ${styles.otpInput}`}
                                placeholder="XXXX"
                                maxLength={4}
                                value={formData.otp}
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            />
                            {errors.otp && <span className={styles.errorText}>{errors.otp}</span>}
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading} style={{ padding: '16px', fontSize: '18px', borderRadius: '12px' }}>
                            {loading ? <Loader2 className="animate-spin inline" /> : 'सत्यापित करें और रजिस्टर करें (Verify & Register)'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={styles.link}
                            style={{ background: 'none', border: 'none', marginTop: '1rem', width: '100%', fontSize: '16px' }}
                        >
                            वापस जाएँ (Back)
                        </button>
                    </form>
                )}

                <p className={styles.linkText}>
                    क्या आपके पास पहले से खाता है? <Link href="/login" className={styles.link}>लॉग इन करें (Sign In)</Link>
                </p>
            </div>
        </div>
    );
}
