export function uploadMiddleware(file) {
	const maxFileSize = 5 * 1024 * 1024; // 5MB
	const allowedTypes = ["image/jpeg", "image/png"];

	if (!file) {
		throw new Error("Nenhum arquivo enviado.");
	}

	if (file.size > maxFileSize) {
		throw new Error("O arquivo excede o tamanho máximo permitido de 5MB.");
	}

	if (!allowedTypes.includes(file.type)) {
		throw new Error(
			"Tipo de arquivo não suportado. Apenas JPEG e PNG são permitidos."
		);
	}

	return true; // Arquivo válido
}
