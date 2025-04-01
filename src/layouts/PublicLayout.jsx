import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PublicLayout() {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Navbar isAuthenticated={false} />
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default PublicLayout;
