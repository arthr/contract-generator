import React, { useState } from 'react';
import uploadService from '../../services/uploadService';
import { Card, FileInput, Alert, Spinner, Label, HelperText } from 'flowbite-react';

function Upload() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const result = await uploadService.uploadFile(file);
            setUploadedFile(result.fileUrl);
            setFileName(result.fileName);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                Upload de Arquivos
            </h1>
            <Card className="dark:bg-slate-800">
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="file" value="Selecione um arquivo para upload" />
                        </div>
                        <FileInput
                            id="file"
                            onChange={handleFileUpload}
                            disabled={loading}
                        />
                        <HelperText className={"ml-2 text-xs text-slate-500 dark:text-slate-400"}>
                            SVG, PNG, JPG ou GIF (MAX. 5MB)
                        </HelperText>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2">
                            <Spinner size="sm" />
                            <span className={"text-slate-500 dark:text-slate-400"}>Carregando...</span>
                        </div>
                    )}

                    {error && (
                        <Alert color="failure">
                            {error}
                        </Alert>
                    )}

                    {uploadedFile && (
                        <div className="mt-4">
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                                Arquivo enviado:
                            </h3>
                            <figure className="max-w-lg mx-auto relative">
                                <figcaption className="text-sm text-slate-500 dark:text-slate-400
                                    absolute top-0 left-0 right-0 text-center
                                    p-2 z-10">
                                    {fileName || "Arquivo enviado"}
                                </figcaption>
                                <img
                                    src={uploadedFile}
                                    alt="Uploaded"
                                    className="h-auto max-w-xs md:max-w-lg mx-auto rounded-lg 
                                    shadow-lg shadow-black/80 hover:shadow-cyan-600/80 dark:shadow-black/80
                                    hover:dark:shadow-cyan-600/60
                                    transition-all duration-300 ease-in-out"
                                />
                            </figure>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default Upload;
