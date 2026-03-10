"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const isPublicRoute = pathname === '/login' || pathname === '/register';
            const userState = localStorage.getItem('kisan_currentUser');

            if (!userState && !isPublicRoute) {
                // Not logged in and trying to access protected route -> go to login
                setAuthorized(false);
                router.push('/login');
            } else if (userState && isPublicRoute) {
                // Logged in but trying to access login/register -> go to home
                setAuthorized(true);
                router.push('/');
            } else {
                // Allowed
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Show nothing while resolving to prevent layout flash
    if (!authorized && pathname !== '/login' && pathname !== '/register') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
                <h2 style={{ color: '#2e7d32' }}>Loading...</h2>
            </div>
        );
    }

    return <>{children}</>;
}
