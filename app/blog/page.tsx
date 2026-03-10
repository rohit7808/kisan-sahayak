"use client";

import styles from './page.module.css';

const BLOG_POSTS = [
    {
        title: 'Modern Drip Irrigation Techniques',
        excerpt: 'Learn how drip irrigation can save up to 50% water and increase yield.',
        date: 'Feb 1, 2024',
        author: 'Dr. R.K. Singh'
    },
    {
        title: 'Organic Farming: A Beginner’s Guide',
        excerpt: 'Step-by-step guide to shifting from chemical to organic farming.',
        date: 'Jan 28, 2024',
        author: 'Kisan Seva Team'
    },
    {
        title: 'Pest Management in Cotton Crops',
        excerpt: 'Identifying and controlling pink bollworm in cotton fields effectively.',
        date: 'Jan 20, 2024',
        author: 'Agri Expert'
    },
    {
        title: 'Soil Health Management Tips',
        excerpt: 'How to maintain soil fertility using natural compost and crop rotation.',
        date: 'Jan 15, 2024',
        author: 'Soil Lab'
    }
];

export default function BlogPage() {
    return (
        <div className={`container ${styles.container}`}>
            <h1 className={styles.title}>Farming Tips & Blog</h1>

            <div className={styles.grid}>
                {BLOG_POSTS.map((post, index) => (
                    <article key={index} className={styles.card}>
                        <div className={styles.date}>{post.date}</div>
                        <h2>{post.title}</h2>
                        <p>{post.excerpt}</p>
                        <div className={styles.footer}>
                            <span className={styles.author}>By {post.author}</span>
                            <button className={styles.readMore}>Read Article</button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
