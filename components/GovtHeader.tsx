import styles from './GovtHeader.module.css';
import Link from 'next/link';

export default function GovtHeader() {
    return (
        <header>
            {/* Top Strip */}
            <div className={styles.topBar}>
                <div className={styles.container}>
                    <div className={styles.govtLinks}>
                    </div>

                </div>
            </div>

            {/* Main Branding Band - Simplified for this project since we have a Navbar below */}
            {/* We will let Navbar handle the main navigation, but this adds the official top touch */}
        </header>
    );
}
