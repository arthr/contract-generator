import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../layouts/PublicLayout';

function AppRoutes() {
    return (
        <Routes>
            {routes.map((group, groupIndex) => {
                const { routeType, routePrefix, routes: groupRoutes } = group;

                // Rotas públicas
                if (routeType === "public") {
                    return (
                        <Route key={groupIndex} element={<PublicLayout />}>
                            {groupRoutes.map((route, routeIndex) => (
                                <Route
                                    key={routeIndex}
                                    path={route.path}
                                    element={<route.component />}
                                />
                            ))}
                        </Route>
                    );
                }

                // Rotas privadas
                if (routeType === "private") {
                    return (
                        <Route key={groupIndex} path={routePrefix} element={<ProtectedRoute />}>
                            {groupRoutes.map((route, routeIndex) => (
                                <Route
                                    key={routeIndex}
                                    path={route.path}
                                    element={<route.component />}
                                />
                            ))}
                        </Route>
                    );
                }

                return null;
            })}
        </Routes>
    );
}

export default AppRoutes;