import React from 'react';
import { Label, FileInput, HelperText } from 'flowbite-react';
import { HiDocumentText } from 'react-icons/hi';

function FileUploader({ fileInputRef, nomeArquivo, error, onChange }) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="template" value="Arquivo de Template (.docx ou .dotx)*" />
      </div>
      <FileInput
        id="template"
        ref={fileInputRef}
        color={error ? "failure" : undefined}
        onChange={onChange}
      />
      <HelperText color={error ? "failure" : undefined} className="mt-1">
        {error || "Faça upload de um arquivo Word (.docx) ou template (.dotx) com as variáveis."}
      </HelperText>
      
      {nomeArquivo && (
        <div className="mt-2 p-2 border border-gray-600 rounded-md flex items-center">
          <HiDocumentText className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm truncate">{nomeArquivo}</span>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        O arquivo deve conter as variáveis no formato correto: {'{principal.nome}'}, {'{#lista}...{/lista}'}, etc.
      </p>
    </div>
  );
}

export default FileUploader;