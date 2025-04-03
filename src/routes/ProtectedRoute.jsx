import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import DefaultLayout from '../layouts/DefaultLayout';

function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <DefaultLayout>
            <Outlet />
        </DefaultLayout>
    );
}

export default ProtectedRoute;
