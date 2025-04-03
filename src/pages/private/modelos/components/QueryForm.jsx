import React from 'react';
import { Textarea, Label, HelperText } from 'flowbite-react';

function QueryForm({ query, error, onChange }) {
  return (
    <div className="md:col-span-2">
      <div className="mb-2 block">
        <Label htmlFor="queryPrincipal" value="Query Principal*" />
      </div>
      <Textarea
        id="queryPrincipal"
        name="queryPrincipal"
        value={query}
        onChange={onChange}
        rows={4}
        color={error ? "failure" : undefined}
        placeholder="SELECT * FROM contratos WHERE id = :id_contrato"
        className="font-mono text-sm"
      />
      <HelperText color={error ? "failure" : undefined} className="mt-1">
        {error || "Esta query deve retornar uma única linha, fornecendo dados para todas as variáveis simples."}
      </HelperText>
    </div>
  );
}

export default QueryForm;