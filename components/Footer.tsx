import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.section}>
                    <h3>Kisan Sahayak</h3>
                    <p>Empowering farmers with technology for a better harvest.</p>
                </div>
                <div className={styles.section}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/weather">Weather</a></li>
                        <li><a href="/crops">Crops</a></li>
                        <li><a href="/market">Market Price</a></li>
                    </ul>
                </div>
                <div className={styles.section}>
                    <h4>Contact</h4>
                    <p>Helpline: 7808507459</p>
                    <p>Email: rohitk6084@gmail.com</p>
                </div>
            </div>
            <div className={styles.copyright}>
                <p>&copy; 2026 Kisan Sahayak Agriculture Website. All rights reserved.</p>
            </div>
        </footer >
    );
}
