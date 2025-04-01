// Serviço para validação e gerenciamento de uploads
const uploadService = {
	validateFile: (file) => {
		const maxFileSize = 5 * 1024 * 1024; // 5MB
		const allowedTypes = ["image/jpeg", "image/png"];

		if (!file) {
			throw new Error("Nenhum arquivo enviado.");
		}

		if (file.size > maxFileSize) {
			throw new Error(
				"O arquivo excede o tamanho máximo permitido de 5MB."
			);
		}

		if (!allowedTypes.includes(file.type)) {
			throw new Error(
				"Tipo de arquivo não suportado. Apenas JPEG e PNG são permitidos."
			);
		}

		return true;
	},

	// Método para upload (simulado)
	uploadFile: async (file) => {
		// Validar o arquivo antes do upload
		uploadService.validateFile(file);

		// Simulação de upload - aqui seria uma chamada real para API
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					success: true,
					fileName: file.name,
					fileUrl: URL.createObjectURL(file),
				});
			}, 1000);
		});
	},
};

export default uploadService;
