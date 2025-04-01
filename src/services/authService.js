// Serviço para gerenciar a autenticação
const authService = {
	// Verifica se o usuário está autenticado
	isAuthenticated: () => {
		return localStorage.getItem("authToken") !== null;
	},

	// Login (exemplo simplificado)
	login: async (credentials) => {
		// Simulando uma chamada à API
		return new Promise((resolve) => {
			setTimeout(() => {
				// Armazenar token (simulado)
				localStorage.setItem("authToken", "dummy-token");

				// Retornar dados do usuário incluindo username
				resolve({
					user: {
						username: credentials.username,
						// outros dados do usuário que você precisa
					},
				});
			}, 500);
		});
	},

	// Logout
	logout: () => {
		localStorage.removeItem("authToken");
	},
};

export default authService;
