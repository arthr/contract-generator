import React, { useState } from 'react';

function FileUploader({ fileInputRef, nomeArquivo, error, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [fileSize, setFileSize] = useState(null);
  
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  const formatarTamanhoArquivo = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChangeWithValidation = (e) => {
    setUploading(true);
    
    // Simula um pequeno atraso para mostrar o estado de upload
    setTimeout(() => {
      onChange(e);
      
      const file = e.target.files[0];
      if (file) {
        setFileSize(formatarTamanhoArquivo(file.size));
      }
      
      setUploading(false);
    }, 500);
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-gray-700 font-medium mb-2">
        Arquivo de Template do Word (.dotx)*
      </label>
      <div className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-4 flex items-center`}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".dotx,.docx"
          onChange={handleFileChangeWithValidation}
          className="hidden"
        />
        
        <div className="flex-grow">
          {uploading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-700">Processando arquivo...</span>
            </div>
          ) : nomeArquivo ? (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-gray-800">{nomeArquivo}</span>
                {fileSize && (
                  <span className="text-gray-500 text-xs ml-2">({fileSize})</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum arquivo selecionado</p>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleBrowseClick}
          disabled={uploading}
          className={`ml-4 px-4 py-2 border rounded-md ${
            uploading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 transition-colors'
          }`}
        >
          {nomeArquivo ? 'Alterar arquivo' : 'Escolher arquivo'}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      <p className="text-sm text-gray-500 mt-2">
        Envie um arquivo de template do Word (.dotx) contendo seu modelo de contrato com as variáveis marcadas conforme os formatos mostrados na tabela acima.
        <br />
        <span className="text-xs italic mt-1 block">
          Nota: O arquivo será renomeado automaticamente de acordo com o título do modelo.
        </span>
      </p>
    </div>
  );
}

export default FileUploader; 