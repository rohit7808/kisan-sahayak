"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/Auth.module.css';
import { Camera, User, ArrowLeft, LogOut, Loader2, Download, CreditCard } from 'lucide-react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: '',
        mobile: '',
        email: '',
        village: '',
        cropType: '',
        farmSize: '',
        profilePicture: '',
        farmerId: ''
    });

    const idCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadProfile = () => {
            const userStr = localStorage.getItem('kisan_currentUser');
            if (!userStr) {
                router.push('/login');
                return;
            }
            const user = JSON.parse(userStr);

            // Generate ID if doesn't exist yet
            let currentFarmerId = user.farmerId;
            if (!currentFarmerId) {
                currentFarmerId = `KSH-${Math.floor(100000 + Math.random() * 900000)}`;
                user.farmerId = currentFarmerId;

                // Save it back to storage silently
                localStorage.setItem('kisan_currentUser', JSON.stringify(user));
                const usersStr = localStorage.getItem('kisan_users');
                if (usersStr) {
                    const users = JSON.parse(usersStr);
                    const idx = users.findIndex((u: any) => u.mobile === user.mobile || u.email === user.email);
                    if (idx !== -1) {
                        users[idx].farmerId = currentFarmerId;
                        localStorage.setItem('kisan_users', JSON.stringify(users));
                    }
                }
            }

            setProfile({
                name: user.name || '',
                mobile: user.mobile || '',
                email: user.email || '',
                village: user.village || '',
                cropType: user.cropType || '',
                farmSize: user.farmSize || '',
                profilePicture: user.profilePicture || '',
                farmerId: currentFarmerId
            });
        };
        loadProfile();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setProfile(prev => ({ ...prev, profilePicture: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            // Update Active Session
            localStorage.setItem('kisan_currentUser', JSON.stringify(profile));

            // Update Users Array
            const usersStr = localStorage.getItem('kisan_users');
            if (usersStr) {
                const users = JSON.parse(usersStr);
                const userIndex = users.findIndex((u: any) => u.mobile === profile.mobile || u.email === profile.email);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...profile };
                    localStorage.setItem('kisan_users', JSON.stringify(users));
                }
            }

            setLoading(false);
            setIsEditing(false);
            alert('प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई (Profile Updated Successfully)!');

            // Dispatch a custom event so the Navbar can update its icon immediately
            window.dispatchEvent(new Event('profileUpdated'));
        }, 800);
    };

    const handleLogout = () => {
        localStorage.removeItem('kisan_currentUser');
        router.push('/login');
    };

    const handleDownloadIdCard = async () => {
        if (!idCardRef.current) return;

        try {
            const canvas = await html2canvas(idCardRef.current, {
                scale: 2, // Higher resolution
                useCORS: true, // If any external images
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [85.6, 54] // CR80 standard credit card size (landscape sideways) 54x85.6
            });

            // We'll map the canvas aspect ratio onto the card
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Kisan_Sahayak_ID_${profile.name.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('Error generating PDF', err);
            alert('PDF डाउनलोड करने में समस्या आई (Error downloading PDF).');
        }
    };

    return (
        <div className={styles.container} style={{ padding: '2rem 1rem' }}>
            <div className={styles.authCard} style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Link href="/" style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        <ArrowLeft size={20} /> होम (Home)
                    </Link>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                        लॉगआउट (Logout) <LogOut size={20} />
                    </button>
                </div>

                <h1 className={styles.title}>मेरी प्रोफ़ाइल (My Profile)</h1>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: '#e8f5e9',
                            border: '4px solid #4caf50',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            cursor: isEditing ? 'pointer' : 'default',
                            overflow: 'hidden'
                        }}
                        onClick={() => isEditing && fileInputRef.current?.click()}
                    >
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={60} color="#4caf50" />
                        )}

                        {isEditing && (
                            <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', textAlign: 'center', padding: '0.2rem' }}>
                                <Camera color="white" size={20} />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>

                <div className={styles.form}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>पूरा नाम (Full Name)</label>
                            <input
                                type="text"
                                name="name"
                                className={styles.input}
                                value={profile.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>मोबाइल नंबर (Mobile)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={profile.mobile}
                                disabled={true} // Usually shouldn't change easily
                                style={{ background: '#f5f5f5', color: '#666' }}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>ईमेल (Email)</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={profile.email}
                            disabled={true} // Usually shouldn't change easily
                            style={{ background: '#f5f5f5', color: '#666' }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>गाँव / जिला (Village / District)</label>
                        <input
                            type="text"
                            name="village"
                            className={styles.input}
                            placeholder="अपना गाँव या जिला लिखें"
                            value={profile.village}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>फसल का प्रकार (Crop Type)</label>
                            <input
                                type="text"
                                name="cropType"
                                className={styles.input}
                                placeholder="जैसे: गेहूं, धान"
                                value={profile.cropType}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>खेत का आकार - एकड़ (Farm Size)</label>
                            <input
                                type="number"
                                name="farmSize"
                                className={styles.input}
                                placeholder="जैसे: 5"
                                value={profile.farmSize}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    className={styles.submitBtn}
                                    onClick={handleSave}
                                    disabled={loading}
                                    style={{ flex: 1, padding: '16px', fontSize: '18px', borderRadius: '12px' }}
                                >
                                    {loading ? <Loader2 className="animate-spin inline" /> : 'सुरक्षित करें (Save)'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{ flex: 1, padding: '16px', fontSize: '18px', borderRadius: '12px', background: '#ffebee', color: '#d32f2f', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    रद्द करें (Cancel)
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className={styles.submitBtn}
                                onClick={() => setIsEditing(true)}
                                style={{ padding: '16px', fontSize: '18px', borderRadius: '12px', background: '#e8f5e9', color: '#2e7d32', border: '2px solid #2e7d32' }}
                            >
                                प्रोफ़ाइल संपादित करें (Edit Profile)
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Farmer ID Card Section */}
            {!isEditing && profile.name && (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ color: '#2e7d32', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={24} /> मेरा किसान पहचान पत्र (My ID Card)
                    </h2>

                    <div
                        ref={idCardRef}
                        style={{
                            width: '320px',
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            border: '2px solid #81c784',
                            padding: '1.5rem',
                            position: 'relative',
                            overflow: 'hidden',
                            fontFamily: 'sans-serif'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #a5d6a7', paddingBottom: '10px', marginBottom: '15px' }}>
                            <div style={{ background: '#2e7d32', color: 'white', padding: '5px', borderRadius: '50%' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', color: '#1b5e20', fontWeight: 'bold' }}>किसान सहायक</h3>
                                <p style={{ margin: 0, fontSize: '10px', color: '#388e3c' }}>Kisan Sahayak ID Card</p>
                            </div>
                        </div>

                        {/* ID Picture and Data */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flexShrink: 0 }}>
                                {profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt="Profile"
                                        style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #4caf50' }}
                                    />
                                ) : (
                                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #a5d6a7' }}>
                                        <User size={40} color="#81c784" />
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: '6px' }}>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Farmer ID</p>
                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#1b5e20' }}>{profile.farmerId}</p>
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name (नाम)</p>
                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>{profile.name}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Village (गाँव)</p>
                                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: '#444' }}>{profile.village || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Footer */}
                        <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #a5d6a7', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '9px', color: '#666' }}>Crop (फसल)</p>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#2e7d32' }}>{profile.cropType || 'N/A'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '9px', color: '#666' }}>Farm Size (खेत)</p>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#2e7d32' }}>{profile.farmSize ? `${profile.farmSize} Acres` : 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadIdCard}
                        className={styles.submitBtn}
                        style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 24px', fontSize: '16px', borderRadius: '12px', background: '#1976d2', border: 'none' }}
                    >
                        <Download size={20} />
                        पहचान पत्र डाउनलोड करें (Download ID)
                    </button>
                </div>
            )}
        </div>
    );
}
