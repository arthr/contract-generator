import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import { useLayout } from '../contexts/layout';

function DefaultLayout({ children }) {
    const { isMobile, sidebarCollapsed } = useLayout();

    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
            {/* Navbar */}
            <Navbar isAuthenticated={true} />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={`p-4 min-h-screen transition-all duration-300 ${isMobile ? 'md:ml-64' : sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
                } pt-20`}>
                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Page Content */}
                {children}
            </main>
        </div>
    );
}

export default DefaultLayout;
