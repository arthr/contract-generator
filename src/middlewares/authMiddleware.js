export function authMiddleware(Component) {
	return function AuthenticatedComponent(props) {
		const isAuthenticated = Boolean(localStorage.getItem("authToken")); // Exemplo simples de autenticação
		if (!isAuthenticated) {
			window.location.href = "/"; // Redireciona para a página inicial se não autenticado
			return null;
		}
		return <Component {...props} />;
	};
}
