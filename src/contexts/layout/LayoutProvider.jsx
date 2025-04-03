import React, { useState, useEffect, useCallback } from 'react';
import routes from '../../routes/routes';
import LayoutContext from './LayoutContext';

export function LayoutProvider({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState ? JSON.parse(savedState) : window.innerWidth < 768;
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [searchQuery, setSearchQuery] = useState('');
    const [breadcrumbs, setBreadcrumbs] = useState([{ title: 'Home', path: '/' }]);

    const menuItems = routes.filter(route => route.showInMenu);

    useEffect(() => {
        if (localStorage.getItem('flowbite-theme-mode') === 'dark' || (!('flowbite-theme-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, []);

    useEffect(() => {
        const handleThemeChange = (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && !sidebarCollapsed) {
                setSidebarCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarCollapsed]);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    const updateBreadcrumbs = useCallback((baseBreadcrumb, pathname) => {
        let pathToProcess = pathname;
        const routeGroup = routes.find(group =>
            group.routePrefix && pathname.startsWith(group.routePrefix)
        );

        if (routeGroup?.breadcrumbTitle && baseBreadcrumb.length > 0) {
            baseBreadcrumb[0].title = routeGroup.breadcrumbTitle;
        }

        if (routeGroup && routeGroup.routePrefix) {
            pathToProcess = pathname.replace(routeGroup.routePrefix, '');
            if (pathToProcess === '') {
                setBreadcrumbs(baseBreadcrumb);
                return;
            }
        }

        const pathParts = pathToProcess.split('/').filter(Boolean);
        const newBreadcrumbs = pathParts.map((part, index) => {
            const prefix = routeGroup?.routePrefix || '';
            const relativePath = `/${pathParts.slice(0, index + 1).join('/')}`;
            const fullPath = `${prefix}${relativePath}`;

            let matchedRoute = null;
            routes.forEach(group => {
                const foundRoute = group.routes.find(r =>
                    (prefix + '/' + r.path) === fullPath ||
                    r.path === relativePath.substring(1)
                );
                if (foundRoute) matchedRoute = foundRoute;
            });

            return {
                title: matchedRoute?.breadcrumbTitle || matchedRoute?.title || part,
                path: fullPath
            };
        });

        setBreadcrumbs([...baseBreadcrumb, ...newBreadcrumbs]);
    }, []);

    return (
        <LayoutContext.Provider value={{
            sidebarCollapsed,
            setSidebarCollapsed,
            toggleSidebar,
            isMobile,
            searchQuery,
            setSearchQuery,
            menuItems,
            breadcrumbs,
            updateBreadcrumbs
        }}>
            {children}
        </LayoutContext.Provider>
    );
} 