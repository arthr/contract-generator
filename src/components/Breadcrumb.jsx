import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb as FlowbiteBreadcrumb, BreadcrumbItem } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useLayout } from "../contexts/layout";
import { useAuth } from "../contexts/auth";
import { Link } from "react-router-dom";
import routes from "../routes/routes";

function Breadcrumb() {
    const { breadcrumbs, updateBreadcrumbs } = useLayout();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const isAuthenticated = !!user;

        // Identificar o grupo de rotas atual
        const routeGroup = routes.find(group =>
            (isAuthenticated && group.routeType === "private" && pathname.startsWith(group.routePrefix)) ||
            (!isAuthenticated && group.routeType === "public")
        );

        // Configurar o breadcrumb base com base na autenticação
        const baseBreadcrumb = isAuthenticated && routeGroup?.routePrefix
            ? [{ title: routeGroup?.breadcrumbTitle, path: routeGroup.routePrefix }]
            : [{ title: 'Home', path: '/' }];

        // Atualizar os breadcrumbs
        updateBreadcrumbs(baseBreadcrumb, pathname);
    }, [location.pathname, updateBreadcrumbs, user]);

    // Não mostrar breadcrumb se tiver apenas um item ou nenhum
    if (!breadcrumbs || breadcrumbs.length <= 0) {
        return null;
    }

    return (
        <FlowbiteBreadcrumb
            aria-label="Breadcrumb"
            className="bg-gray-50 px-3 py-2 mb-4 rounded-lg dark:bg-gray-800"
        >
            {breadcrumbs.map((item, index) => (
                <BreadcrumbItem
                    key={index}
                    href={index === breadcrumbs.length - 1 && breadcrumbs.length > 1 ? undefined : item.path}
                    icon={index === 0 ? HiHome : undefined}
                    as={Link}
                    to={item.path}
                >
                    {item.title}
                </BreadcrumbItem>
            ))}
        </FlowbiteBreadcrumb>
    );
}

export default Breadcrumb;
